import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Hello World worker', () => {
	it('responds with Hello World! (unit style)', async () => {
		const request = new IncomingRequest('http://example.com');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
	});

	it('responds with Hello World! (integration style)', async () => {
		const response = await SELF.fetch('https://example.com');
        expect(await response.text()).toMatchInlineSnapshot(`
            "<!DOCTYPE html>
<html lang=\\"zh-CN\\">
<head>
    <meta charset=\\"UTF-8\\">
    <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\">
    <title>彩虹過三關</title>
    <!-- ... rest of HTML omitted for brevity ... -->
</head>
<body>
    <!-- ... rest of HTML omitted for brevity ... -->
</body>
</html>"
        `);
	});
});
