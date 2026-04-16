/**
 * Rollback scenario test script for the MetricFlow API.
 *
 * Demonstrates how a faulty deployment is detected via health thresholds
 * and how the system decides whether to trigger a rollback.
 *
 * Run with: npx tsx packages/api/src/routes/__tests__/rollback-test.ts
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HealthData {
  status: string;
  errorRate: number;
  responseTime: number;
}

interface HealthCheckResult {
  healthy: boolean;
  violations: string[];
}

interface RealtimeMetrics {
  activeUsers: number;
  revenue: number;
  errorRate: number;
}

// ---------------------------------------------------------------------------
// Thresholds
// ---------------------------------------------------------------------------

const THRESHOLDS = {
  ERROR_RATE: 0.05,
  RESPONSE_TIME_MS: 500,
  EXPECTED_STATUS: 'healthy',
} as const;

// ---------------------------------------------------------------------------
// Exported functions
// ---------------------------------------------------------------------------

/**
 * Simulates a faulty deployment by returning realtime metrics with an
 * error rate exceeding 10 %, mimicking a broken release.
 */
export function simulateFaultyDeployment(): RealtimeMetrics {
  const faultyErrorRate = 0.10 + Math.random() * 0.15; // 10-25 %
  const metrics: RealtimeMetrics = {
    activeUsers: Math.floor(Math.random() * 2000) + 1000,
    revenue: Math.floor(Math.random() * 20000) + 40000,
    errorRate: parseFloat(faultyErrorRate.toFixed(4)),
  };

  console.log('[simulateFaultyDeployment] Injected faulty metrics:', metrics);
  return metrics;
}

/**
 * Evaluates health data against predefined thresholds and returns a result
 * indicating whether the service is healthy and which thresholds were violated.
 */
export function checkHealthThresholds(healthData: HealthData): HealthCheckResult {
  const violations: string[] = [];

  if (healthData.errorRate >= THRESHOLDS.ERROR_RATE) {
    violations.push(
      `error_rate ${healthData.errorRate} exceeds threshold ${THRESHOLDS.ERROR_RATE}`,
    );
  }

  if (healthData.responseTime >= THRESHOLDS.RESPONSE_TIME_MS) {
    violations.push(
      `response_time ${healthData.responseTime}ms exceeds threshold ${THRESHOLDS.RESPONSE_TIME_MS}ms`,
    );
  }

  if (healthData.status !== THRESHOLDS.EXPECTED_STATUS) {
    violations.push(
      `status '${healthData.status}' does not match expected '${THRESHOLDS.EXPECTED_STATUS}'`,
    );
  }

  return { healthy: violations.length === 0, violations };
}

/**
 * Decides whether a rollback should be triggered based on the list of
 * threshold violations. Any violation is sufficient to trigger a rollback.
 */
export function shouldRollback(violations: string[]): boolean {
  return violations.length > 0;
}

// ---------------------------------------------------------------------------
// Test runner
// ---------------------------------------------------------------------------

function run(): void {
  console.log('=== Rollback Scenario Test ===\n');

  // 1. Simulate a faulty deployment
  const faultyMetrics = simulateFaultyDeployment();

  // 2. Build health data from the faulty metrics
  const healthData: HealthData = {
    status: 'degraded',
    errorRate: faultyMetrics.errorRate,
    responseTime: 750, // simulated slow response
  };

  console.log('\n[checkHealthThresholds] Evaluating health data:', healthData);
  const result = checkHealthThresholds(healthData);
  console.log('[checkHealthThresholds] Result:', result);

  // 3. Decide whether to rollback
  const rollback = shouldRollback(result.violations);
  console.log(`\n[shouldRollback] Decision: ${rollback ? 'ROLLBACK' : 'OK'}`);

  // 4. Also test a healthy scenario
  console.log('\n--- Healthy scenario ---');
  const healthyData: HealthData = {
    status: 'healthy',
    errorRate: 0.01,
    responseTime: 120,
  };
  const healthyResult = checkHealthThresholds(healthyData);
  console.log('[checkHealthThresholds] Healthy result:', healthyResult);
  console.log(
    `[shouldRollback] Decision: ${shouldRollback(healthyResult.violations) ? 'ROLLBACK' : 'OK'}`,
  );

  // 5. Summary
  console.log('\n=== Summary ===');
  console.log(`Faulty deployment detected: ${!result.healthy}`);
  console.log(`Violations: ${result.violations.length}`);
  console.log(`Rollback triggered: ${rollback}`);
  console.log(`Healthy scenario passed: ${healthyResult.healthy}`);
}

run();
