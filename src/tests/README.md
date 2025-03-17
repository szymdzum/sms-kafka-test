# SMS Testing Utilities

This directory contains utilities for testing SMS functionality in the application.

## Infobip SMS Testing

The `infobip-batch-test.ts` file provides utilities for testing SMS sending via the Infobip API with configurable options.

### Features

- Generate sample SMS messages with configurable parameters
- Create batches of messages with specific brand distributions
- Test sending messages through the Infobip API
- Dry run mode to preview messages without sending them

### Quick Start

To run a test with default settings (dry run, no messages actually sent):

```bash
npx tsx src/tests/run-infobip-test.ts
```

### Configuration Options

The test runner supports various command-line options:

```bash
npx tsx src/tests/run-infobip-test.ts [--send] [--count=10] [--bq=60] [--tp=30] [--sf=10] [--kf=0] [--print-only]
```

Options:
- `--send` - Actually send the SMS messages (default: dry run)
- `--count=N` - Number of messages to generate (default: 5)
- `--bq=N` - Percentage of B&Q messages (default: 33)
- `--tp=N` - Percentage of TradePoint messages (default: 33)
- `--sf=N` - Percentage of Screwfix messages (default: 33)
- `--kf=N` - Percentage of Kingfisher messages (default: 0)
- `--print-only` - Only print the generated messages, don't attempt to send

### Examples

1. Generate and print 10 messages with equal distribution:
```bash
npx tsx src/tests/run-infobip-test.ts --count=10 --print-only
```

2. Generate 20 messages with custom distribution:
```bash
npx tsx src/tests/run-infobip-test.ts --count=20 --bq=50 --tp=30 --sf=20 --print-only
```

3. Actually send 5 test SMS messages (60% B&Q, 40% TradePoint):
```bash
npx tsx src/tests/run-infobip-test.ts --count=5 --bq=60 --tp=40 --sf=0 --send
```

### Environment Configuration

The tests use the `MY_NUMBER` environment variable from your `.env` file as the default destination for SMS messages. Make sure this is properly configured before running tests.

## SOAP Batch Testing

The `soap-batch-test.ts` file provides utilities for testing SOAP XML message generation and parsing. It generates sample SOAP messages with different brand distributions and tests the parsing functionality.