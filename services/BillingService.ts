import { User, Entitlements } from '../types';
import { MockService } from './mockData';

export interface Product {
  id: string;
  type: 'subscription' | 'consumable';
  title: string;
  description: string;
  price: string;
}

export const PRODUCT_CATALOG: Product[] = [
  { id: 'com.thurzt.plus.monthly', type: 'subscription', title: 'Thurzt+ Monthly', description: 'Ghost Mode, Private Photos, 3 IM/month', price: '$9.99/mo' },
  { id: 'com.thurzt.plus.yearly', type: 'subscription', title: 'Thurzt+ Yearly', description: 'Ghost Mode, Private Photos, 3 IM/month', price: '$99.99/yr' },
  { id: 'com.thurzt.pro.weekly', type: 'subscription', title: 'Thurzt Pro Weekly', description: 'Ghost Mode, Private Photos, 5 IM/month', price: '$6.99/wk' },
  { id: 'com.thurzt.pro.monthly', type: 'subscription', title: 'Thurzt Pro Monthly', description: 'Ghost Mode, Private Photos, 5 IM/month', price: '$19.99/mo' },
  { id: 'com.thurzt.pro.yearly', type: 'subscription', title: 'Thurzt Pro Yearly', description: 'Ghost Mode, Private Photos, 5 IM/month', price: '$199.99/yr' },
  { id: 'com.thurzt.im.1', type: 'consumable', title: '1 Instant Message', description: 'Send 1 Instant Message', price: '$1.99' },
  { id: 'com.thurzt.im.3', type: 'consumable', title: '3 Instant Messages', description: 'Send 3 Instant Messages', price: '$3.99' },
  { id: 'com.thurzt.im.5', type: 'consumable', title: '5 Instant Messages', description: 'Send 5 Instant Messages', price: '$4.99' },
  { id: 'com.thurzt.boost.1h', type: 'consumable', title: '1 Hour Boost', description: 'Boost your profile for 1 hour', price: '$3.99' },
  { id: 'com.thurzt.boost.12h', type: 'consumable', title: '12 Hour Boost', description: 'Boost your profile for 12 hours', price: '$14.99' },
  { id: 'com.thurzt.boost.24h', type: 'consumable', title: '24 Hour Boost', description: 'Boost your profile for 24 hours', price: '$24.99' },
];

export interface BillingService {
  getProductCatalog(): Product[];
  purchase(productId: string): Promise<boolean>;
  restorePurchases(): Promise<boolean>;
  getEntitlements(): Entitlements;
  applyMonthlyAllowanceIfDue(user: User): void;
  activateBoost(durationHours: 1 | 12 | 24): boolean;
  consumeInstantMessage(): boolean;
  forceMonthlyReset(): void;
}

class MockBillingServiceImpl implements BillingService {
  private getStoredPurchases(): string[] {
    try {
      const stored = localStorage.getItem('thurzt_mock_purchases');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private addStoredPurchase(productId: string) {
    const purchases = this.getStoredPurchases();
    if (productId.startsWith('com.thurzt.plus') || productId.startsWith('com.thurzt.pro')) {
      const filtered = purchases.filter(p => !(p.startsWith('com.thurzt.plus') || p.startsWith('com.thurzt.pro')));
      filtered.push(productId);
      localStorage.setItem('thurzt_mock_purchases', JSON.stringify(filtered));
    } else {
      purchases.push(productId);
      localStorage.setItem('thurzt_mock_purchases', JSON.stringify(purchases));
    }
  }

  getProductCatalog(): Product[] {
    return PRODUCT_CATALOG;
  }

  async purchase(productId: string): Promise<boolean> {
    const user = MockService.getCurrentUser();
    if (!user) return false;

    this.addStoredPurchase(productId);

    if (!user.entitlements) this.initEntitlements(user);

    if (productId === 'com.thurzt.plus.monthly' || productId === 'com.thurzt.plus.yearly') {
      user.entitlements!.plan = 'PLUS';
      user.entitlements!.imCredits = Math.max(user.entitlements!.imCredits, 3);
    } else if (productId === 'com.thurzt.pro.weekly' || productId === 'com.thurzt.pro.monthly' || productId === 'com.thurzt.pro.yearly') {
      user.entitlements!.plan = 'PRO';
      user.entitlements!.imCredits = Math.max(user.entitlements!.imCredits, 5);
    } else if (productId === 'com.thurzt.im.1') {
      user.entitlements!.imCredits += 1;
    } else if (productId === 'com.thurzt.im.3') {
      user.entitlements!.imCredits += 3;
    } else if (productId === 'com.thurzt.im.5') {
      user.entitlements!.imCredits += 5;
    } else if (productId === 'com.thurzt.boost.1h') {
      user.entitlements!.balances = user.entitlements!.balances || {};
      user.entitlements!.balances.boosts_1h = (user.entitlements!.balances.boosts_1h || 0) + 1;
    } else if (productId === 'com.thurzt.boost.12h') {
      user.entitlements!.balances = user.entitlements!.balances || {};
      user.entitlements!.balances.boosts_12h = (user.entitlements!.balances.boosts_12h || 0) + 1;
    } else if (productId === 'com.thurzt.boost.24h') {
      user.entitlements!.balances = user.entitlements!.balances || {};
      user.entitlements!.balances.boosts_24h = (user.entitlements!.balances.boosts_24h || 0) + 1;
    }

    this.syncEntitlements(user);
    MockService.updateCurrentUser(user);
    return true;
  }

  async restorePurchases(): Promise<boolean> {
    const user = MockService.getCurrentUser();
    if (!user) return false;

    const purchases = this.getStoredPurchases();
    let plan: 'FREE' | 'PLUS' | 'PRO' = 'FREE';

    if (purchases.includes('com.thurzt.pro.weekly') || purchases.includes('com.thurzt.pro.monthly') || purchases.includes('com.thurzt.pro.yearly')) {
      plan = 'PRO';
    } else if (purchases.includes('com.thurzt.plus.monthly') || purchases.includes('com.thurzt.plus.yearly')) {
      plan = 'PLUS';
    }

    if (!user.entitlements) this.initEntitlements(user);
    user.entitlements!.plan = plan;
    
    if (plan === 'PRO') {
      user.entitlements!.imCredits = Math.max(user.entitlements!.imCredits, 5);
    } else if (plan === 'PLUS') {
      user.entitlements!.imCredits = Math.max(user.entitlements!.imCredits, 3);
    }
    
    this.syncEntitlements(user);
    MockService.updateCurrentUser(user);
    return true;
  }

  private initEntitlements(user: User) {
    user.entitlements = {
      plan: 'FREE',
      imCredits: 0,
      ghostMode: false,
      privatePhotos: false,
      balances: {}
    };
  }

  private syncEntitlements(user: User) {
    if (!user.entitlements) {
      this.initEntitlements(user);
    }
    
    const plan = user.entitlements!.plan;
    user.entitlements!.ghostMode = plan === 'PRO'; // Ghost mode is PRO only
    user.entitlements!.privatePhotos = true; // Enabled for all
  }

  getEntitlements(): Entitlements {
    const user = MockService.getCurrentUser();
    if (!user.entitlements) {
      this.initEntitlements(user);
      this.syncEntitlements(user);
      MockService.updateCurrentUser(user);
    }
    return user.entitlements!;
  }

  applyMonthlyAllowanceIfDue(user: User): void {
    // Simplified for mock
  }

  forceMonthlyReset(): void {
    // Simplified for mock
  }

  consumeInstantMessage(): boolean {
    const user = MockService.getCurrentUser();
    if (!user) return false;
    
    this.syncEntitlements(user);
    const e = user.entitlements!;
    
    if (e.imCredits > 0) {
      e.imCredits -= 1;
      MockService.updateCurrentUser(user);
      return true;
    }
    
    return false;
  }

  activateBoost(durationHours: 1 | 12 | 24): boolean {
    const user = MockService.getCurrentUser();
    if (!user || !user.entitlements || !user.entitlements.balances) return false;

    const key = `boosts_${durationHours}h` as keyof typeof user.entitlements.balances;
    if ((user.entitlements.balances[key] || 0) > 0) {
      user.entitlements.balances[key] -= 1;
      const now = Date.now();
      const currentBoostUntil = user.entitlements.activeBoostUntil || now;
      user.entitlements.activeBoostUntil = Math.max(now, currentBoostUntil) + durationHours * 60 * 60 * 1000;
      MockService.updateCurrentUser(user);
      return true;
    }
    return false;
  }
}

export const billingService: BillingService = new MockBillingServiceImpl();
