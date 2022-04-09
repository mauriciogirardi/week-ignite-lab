import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthUser, CurrentUser } from 'src/http/auth/current-user';
import { CustomersService } from 'src/services/custumers.service';
import { Customer } from '../models/customer';
import { PurchasesServices } from 'src/services/purchases.service';

@Resolver(() => Customer)
export class CustomersResolver {
  constructor(
    private customersService: CustomersService,
    private purchasesService: PurchasesServices,
  ) {}

  @ResolveField()
  purchases(@Parent() customer: Customer) {
    return this.purchasesService.listAllFromCustomer(customer.id);
  }

  @UseGuards(AuthorizationGuard)
  @Query(() => Customer)
  me(@CurrentUser() user: AuthUser) {
    const { sub: authUserId } = user;
    return this.customersService.getCustomerByAuthUserId(authUserId);
  }
}
