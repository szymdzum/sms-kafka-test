import * as dotenv from 'dotenv';
import util from 'util';

// Load environment variables
dotenv.config();

// Define the supported brands
export enum Brand {
  BQUK = 'B&Q',
  TRADEPOINT = 'TradePoint',
  SCREWFIX = 'Screwfix'
}

// Define the SMS details interface
export interface InfobipSmsDetails {
  phoneNumber: string;
  message: string;
  senderId: string;
  orderId?: string;
  messageId?: string;
}

/**
 * Generate a sample SMS message with the given details
 * @param customDetails Optional custom details to include in the generated message
 * @returns SMS details object
 */
export function generateSmsDetails(customDetails?: Partial<InfobipSmsDetails>): InfobipSmsDetails {
  const orderId = customDetails?.orderId || String(Math.floor(10000000 + Math.random() * 90000000));

  // Default values
  const details: InfobipSmsDetails = {
    phoneNumber: process.env.MY_NUMBER || '48889403808', // Default to the number in .env
    message: `Your order ${orderId} has been placed, thank you for your purchase.`,
    senderId: Brand.BQUK, // Default sender
    orderId,
    ...customDetails
  };

  return details;
}

/**
 * Generate a batch of SMS details with configurable brand distribution
 * @param count Total number of SMS messages to generate
 * @param brandDistribution Optional distribution of brands (e.g., {BQUK: 0.6, TRADEPOINT: 0.4})
 * @returns Array of SMS details objects
 */
export function generateSmsBatch(
  count: number = 5,
  brandDistribution?: Partial<Record<keyof typeof Brand, number>>
): InfobipSmsDetails[] {
  const samples: InfobipSmsDetails[] = [];

  // Create default distribution if none provided (equal distribution)
  const distribution = brandDistribution || {};
  const brands = Object.keys(Brand) as Array<keyof typeof Brand>;

  // Fill in missing distribution values with equal weights
  let totalWeight = 0;
  brands.forEach(brand => {
    if (distribution[brand] !== undefined) {
      totalWeight += distribution[brand]!;
    }
  });

  // If total weight is not 1, adjust it
  if (totalWeight === 0) {
    // Equal distribution
    const equalWeight = 1 / brands.length;
    brands.forEach(brand => {
      distribution[brand] = equalWeight;
    });
  } else if (totalWeight < 1) {
    // Distribute remaining weight equally among undefined brands
    const undefinedBrands = brands.filter(brand => distribution[brand] === undefined);
    if (undefinedBrands.length > 0) {
      const remainingWeight = (1 - totalWeight) / undefinedBrands.length;
      undefinedBrands.forEach(brand => {
        distribution[brand] = remainingWeight;
      });
    }
  }

  // Generate random messages based on the distribution
  for (let i = 0; i < count; i++) {
    // Determine which brand to use based on the distribution
    const random = Math.random();
    let cumulativeProb = 0;
    let selectedBrand = brands[0];

    for (const brand of brands) {
      cumulativeProb += distribution[brand] || 0;
      if (random < cumulativeProb) {
        selectedBrand = brand;
        break;
      }
    }

    // Generate sample message for the selected brand
    const orderId = String(100000 + i).padStart(8, '0');
    const messageId = `test-msg-${i}`;

    let message = "";
    switch (selectedBrand) {
      case 'BQUK':
        message = `Your B&Q order ${orderId} has been confirmed. Track your order at diy.com/orders`;
        break;
      case 'TRADEPOINT':
        message = `Your TradePoint order ${orderId} has been placed, thank you for using TradePoint.co.uk`;
        break;
      case 'SCREWFIX':
        message = `Your Screwfix order ${orderId} is ready for collection. Please bring your order confirmation.`;
        break;
      default:
        message = `Your order ${orderId} has been processed. Thank you for your purchase.`;
    }

    // Use the Brand enum to get the sender ID
    const senderIdKey = selectedBrand as keyof typeof Brand;
    const senderId = Brand[senderIdKey];

    samples.push({
      phoneNumber: process.env.MY_NUMBER || '48889403808',
      message,
      senderId,
      orderId,
      messageId
    });
  }

  return samples;
}

/**
 * Test function to generate and send SMS messages using the Infobip client
 * @param dryRun If true, only logs the messages without sending
 */
export async function testInfobipSms(dryRun: boolean = true): Promise<void> {
  try {
    // Example distribution - 60% BQUK, 30% TradePoint, 10% Screwfix
    const distribution = {
      BQUK: 0.6,
      TRADEPOINT: 0.3,
      SCREWFIX: 0.1
    };

    console.log('Generating SMS batch with distribution:', distribution);
    const smsBatch = generateSmsBatch(10, distribution);

    console.log(`Generated ${smsBatch.length} sample SMS messages`);
    console.log('Sample distribution:');

    // Count distribution in generated batch
    const generatedDistribution: Record<string, number> = {};
    smsBatch.forEach(sms => {
      const brand = sms.senderId;
      generatedDistribution[brand] = (generatedDistribution[brand] || 0) + 1;
    });

    Object.entries(generatedDistribution).forEach(([brand, count]) => {
      console.log(`${brand}: ${count} (${Math.round(count / smsBatch.length * 100)}%)`);
    });

    // Print first sample
    console.log('\nFirst sample:');
    console.log(smsBatch[0]);

    if (!dryRun) {
      // Import the sendSms function from infobip-client
      const infobipClient = await import('../packages/infobip-client.js');

      for (const sms of smsBatch) {
        // console.log(`\n-------------------------------------------------------------`);
        // console.log(`Sending to ${sms.phoneNumber}: "${sms.message}" (Sender: ${sms.senderId})`);

        try {
          // Only send if not in dry run mode
          const result = await infobipClient.sendSms(sms.phoneNumber, sms.message, sms.senderId);
          // Use util.inspect to properly display nested objects with colors
          console.log('SMS sent successfully:');
          console.log(util.inspect(result, { depth: null, colors: true }));
          console.log(`-------------------------------------------------------------`);
        } catch (error) {
          console.error('Failed to send SMS:');
          console.error(util.inspect(error, { depth: null, colors: true }));
          console.log(`-------------------------------------------------------------`);
        }

      }
    } else {
      console.log('\nDRY RUN MODE: No messages were actually sent');
    }
  } catch (error) {
    console.error('Error in testInfobipSms:');
    console.error(util.inspect(error, { depth: null, colors: true }));
  }
}

// Use a simpler check for direct execution that doesn't rely on import.meta
// which might cause TSC issues depending on the tsconfig
const isMainModule = process.argv[1]?.endsWith('infobip-batch-test.ts') ||
                    process.argv[1]?.endsWith('infobip-batch-test.js');

// Run the test in dry run mode by default if this file is being executed directly
if (isMainModule) {
  testInfobipSms(true);
}
