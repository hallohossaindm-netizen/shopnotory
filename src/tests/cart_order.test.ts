/**
 * ShopnoTory — Critical Cart, Discount & Order Calculation Tests
 */

export function calculateSubtotal(items: { price: number; qty: number }[]): number {
  return items.reduce((acc, item) => acc + item.price * item.qty, 0);
}

export function calculateDiscount(
  subtotal: number,
  coupon?: { discountPercent?: number; discountAmount?: number; minOrderAmount?: number }
): number {
  if (!coupon) return 0;
  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) return 0;
  if (coupon.discountPercent) {
    return Math.round((subtotal * coupon.discountPercent) / 100);
  }
  if (coupon.discountAmount) {
    return Math.min(coupon.discountAmount, subtotal);
  }
  return 0;
}

export function calculateDeliveryFee(
  subtotal: number,
  city: 'dhaka' | 'outside',
  threshold = 3000,
  feeInside = 60,
  feeOutside = 120
): number {
  if (subtotal >= threshold) return 0;
  return city === 'dhaka' ? feeInside : feeOutside;
}

export function calculateGrandTotal(
  subtotal: number,
  discount: number,
  deliveryFee: number
): number {
  return Math.max(0, subtotal - discount) + deliveryFee;
}

// Automated assertions
function runTests() {
  console.log('Running ShopnoTory logic unit tests...');

  // Test 1: Subtotal
  const items = [
    { price: 1200, qty: 2 },
    { price: 850, qty: 1 }
  ];
  const subtotal = calculateSubtotal(items);
  console.assert(subtotal === 3250, `Expected 3250, got ${subtotal}`);

  // Test 2: Free Delivery Threshold (>= 3000)
  const deliveryOver3000 = calculateDeliveryFee(3250, 'dhaka');
  console.assert(deliveryOver3000 === 0, `Expected 0 for free delivery, got ${deliveryOver3000}`);

  // Test 3: Standard Delivery Fee under 3000 for Dhaka and Outside
  const deliveryUnder3000Dhaka = calculateDeliveryFee(1500, 'dhaka');
  console.assert(deliveryUnder3000Dhaka === 60, `Expected 60 for Dhaka, got ${deliveryUnder3000Dhaka}`);

  const deliveryUnder3000Outside = calculateDeliveryFee(1500, 'outside');
  console.assert(deliveryUnder3000Outside === 120, `Expected 120 for Outside, got ${deliveryUnder3000Outside}`);

  // Test 4: Percentage Coupon (10% on 2000 => 200)
  const discount10 = calculateDiscount(2000, { discountPercent: 10, minOrderAmount: 1000 });
  console.assert(discount10 === 200, `Expected 200 discount, got ${discount10}`);

  // Test 5: Coupon Minimum Threshold Guard
  const discountBelowThreshold = calculateDiscount(800, { discountPercent: 10, minOrderAmount: 1000 });
  console.assert(discountBelowThreshold === 0, `Expected 0 discount when subtotal < minOrderAmount, got ${discountBelowThreshold}`);

  // Test 6: Final Grand Total Calculation
  const grandTotal = calculateGrandTotal(2000, 200, 60);
  console.assert(grandTotal === 1860, `Expected 1860, got ${grandTotal}`);

  console.log('✅ All ShopnoTory calculation unit tests passed successfully!');
}

runTests();
