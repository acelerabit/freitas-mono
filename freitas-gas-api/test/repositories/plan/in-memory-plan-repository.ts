import { Plan } from 'src/application/entities/plan';
import { PlanRepository } from 'src/application/repositories/plan-repository';

export class InMemoryPlanRepository implements PlanRepository {
  public plans: Plan[] = [];

  async create(plan: Plan): Promise<void> {
    this.plans.push(plan);
  }

  async findAll({
    active,
    withTrial,
  }: {
    active?: boolean;
    withTrial?: boolean;
  }): Promise<Plan[]> {
    if (active) {
      return this.plans.filter((plan) => plan.active === true);
    }

    if (withTrial) {
      return this.plans.filter(
        (plan) => plan.active === true && plan.trialDays > 0,
      );
    }

    return this.plans;
  }

  async findFreePlan(): Promise<Plan> {
    return this.plans.find((plan) => plan.value <= 0);
  }

  async delete(planId: string): Promise<void> {
    this.plans = this.plans.filter((plan) => plan.id !== planId);
  }

  async findAllAvailablePlans(): Promise<Plan[]> {
    return this.plans.filter(
      (plan) => (plan.trialDays > 0 && plan.active) || plan.value <= 0,
    );
  }

  async findById(id: string): Promise<Plan | null> {
    const planIndex = this.plans.findIndex((plan) => plan.id === id);

    if (planIndex < 0) {
      return null;
    }

    return this.plans[planIndex];
  }

  async findByDefault(): Promise<Plan> {
    const planIndex = this.plans.findIndex((plan) => plan.isDefault);

    if (planIndex < 0) {
      return null;
    }

    return this.plans[planIndex];
  }

  async turnPlanDefault(id: string): Promise<void> {
    const planIndex = this.plans.findIndex((plan) => plan.id === id);

    if (planIndex < 0) {
      return;
    }

    this.plans[planIndex].isDefault = true;
  }

  async publishPlan(id: string): Promise<void> {
    const planIndex = this.plans.findIndex((plan) => plan.id === id);

    this.plans[planIndex].publishPlan();
  }

  async unpublishPlan(id: string): Promise<void> {
    const planIndex = this.plans.findIndex((plan) => plan.id === id);

    this.plans[planIndex].unpublishPlan();
  }

  async deactivatePlan(id: string): Promise<void> {
    const planIndex = this.plans.findIndex((plan) => plan.id === id);

    this.plans[planIndex].deactivatePlan();
  }

  async activatePlan(id: string): Promise<void> {
    const planIndex = this.plans.findIndex((plan) => plan.id === id);

    this.plans[planIndex].activatePlan();
  }

  async update(plan: Plan): Promise<void> {
    const planIndex = this.plans.findIndex(
      (planItem) => planItem.id === plan.id,
    );

    this.plans[planIndex] = plan;
  }
}
