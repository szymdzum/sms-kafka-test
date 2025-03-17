import { testInfobipSms, Brand, generateSmsBatch } from './infobip-batch-test.js';

/**
 * Command-line runner for the Infobip SMS test
 * Usage:
 *   npx tsx src/tests/run-infobip-test.ts [--send] [--count=10] [--bq=60] [--tp=30] [--sf=10]
 *
 * Options:
 *   --send       : Actually send the SMS messages (default: dry run)
 *   --count=N    : Number of messages to generate (default: 5)
 *   --bq=N       : Percentage of B&Q messages (default: 33)
 *   --tp=N       : Percentage of TradePoint messages (default: 33)
 *   --sf=N       : Percentage of Screwfix messages (default: 33)
 *   --print-only : Only print the generated messages, don't attempt to send
 */
async function main() {
  const args = process.argv.slice(2);

  // Default parameters
  let dryRun = true;
  let count = 5;
  let printOnly = false;

  // Brand distribution percentages (out of 100)
  let bqPercent = 33;
  let tpPercent = 33;
  let sfPercent = 33;

  // Parse command line arguments
  args.forEach(arg => {
    if (arg === '--send') {
      dryRun = false;
    } else if (arg === '--print-only') {
      printOnly = true;
    } else if (arg.startsWith('--count=')) {
      count = parseInt(arg.split('=')[1] || '5', 10);
    } else if (arg.startsWith('--bq=')) {
      bqPercent = parseInt(arg.split('=')[1] || '33', 10);
    } else if (arg.startsWith('--tp=')) {
      tpPercent = parseInt(arg.split('=')[1] || '33', 10);
    } else if (arg.startsWith('--sf=')) {
      sfPercent = parseInt(arg.split('=')[1] || '33', 10);
    }
  });

  // Calculate the distribution (convert percentages to decimals)
  const totalPercent = bqPercent + tpPercent + sfPercent;

  // If total percentages don't add up to 100, adjust them
  if (totalPercent !== 100) {
    console.warn(`Warning: Brand percentages (${totalPercent}%) don't add up to 100%. Adjusting proportionally.`);

    // Scale to make the sum equal to 100%
    const scale = 100 / totalPercent;
    bqPercent = Math.round(bqPercent * scale);
    tpPercent = Math.round(tpPercent * scale);
    sfPercent = Math.round(sfPercent * scale);

    // Ensure we still sum to 100 by adjusting the last non-zero value
    const newTotal = bqPercent + tpPercent + sfPercent;
    const diff = 100 - newTotal;

    if (diff !== 0) {
      if (sfPercent > 0) sfPercent += diff;
      else if (tpPercent > 0) tpPercent += diff;
      else bqPercent += diff;
    }

    console.log(`Adjusted percentages: B&Q=${bqPercent}%, TradePoint=${tpPercent}%, Screwfix=${sfPercent}%`);
  }

  // Convert percentages to distribution fractions
  const distribution: Record<keyof typeof Brand, number> = {
    BQUK: bqPercent / 100,
    TRADEPOINT: tpPercent / 100,
    SCREWFIX: sfPercent / 100
  };

  console.log('Configuration:');
  console.log(`- Message Count: ${count}`);
  console.log(`- Brand Distribution: B&Q=${bqPercent}%, TradePoint=${tpPercent}%, Screwfix=${sfPercent}%`);
  console.log(`- Mode: ${dryRun ? 'Dry Run (no messages sent)' : 'SEND MESSAGES'}`);

  if (printOnly) {
    // Just generate and print the messages without sending
    const smsBatch = generateSmsBatch(count, distribution);

    console.log('\nGenerated SMS Messages:');
    smsBatch.forEach((sms, index) => {
      console.log(`\nMessage #${index + 1}:`);
      console.log(`- To: ${sms.phoneNumber}`);
      console.log(`- From: ${sms.senderId}`);
      console.log(`- Message: "${sms.message}"`);
      console.log(`- Order ID: ${sms.orderId}`);
    });

    // Print distribution statistics
    const generatedDistribution: Record<string, number> = {};
    smsBatch.forEach(sms => {
      const brand = sms.senderId;
      generatedDistribution[brand] = (generatedDistribution[brand] || 0) + 1;
    });

    console.log('\nActual Distribution:');
    Object.entries(generatedDistribution).forEach(([brand, count]) => {
      const percentage = Math.round(count / smsBatch.length * 100);
      console.log(`- ${brand}: ${count} messages (${percentage}%)`);
    });
  } else {
    // Run the actual test
    await testInfobipSms(dryRun);
  }
}

// Check if this file is being executed directly
const isMainModule = process.argv[1]?.endsWith('run-infobip-test.ts') ||
                    process.argv[1]?.endsWith('run-infobip-test.js');

// Run the main function if this file is being executed directly
if (isMainModule) {
  main().catch(error => {
    console.error('Error running Infobip test:', error);
    process.exit(1);
  });
}