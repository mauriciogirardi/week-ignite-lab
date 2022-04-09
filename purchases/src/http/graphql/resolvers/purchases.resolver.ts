import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { UseGuards } from '@nestjs/common';

import { AuthUser, CurrentUser } from 'src/http/auth/current-user';
import { CreatePurchaseInput } from '../inputs/create-purchase-input';
import { PurchasesServices } from 'src/services/purchases.service';
import { CustomersService } from 'src/services/custumers.service';
import { ProductsService } from 'src/services/products.service';
import { Purchase } from '../models/purchase';

@Resolver(() => Purchase)
export class PurchasesResolver {
  constructor(
    private purchasesService: PurchasesServices,
    private productsService: ProductsService,
    private customersService: CustomersService,
  ) {}

  @UseGuards(AuthorizationGuard)
  @Query(() => [Purchase])
  purchases() {
    return this.purchasesService.listAllPurchases();
  }

  @ResolveField()
  product(@Parent() purchases: Purchase) {
    return this.productsService.getProductById(purchases.productId);
  }

  @UseGuards(AuthorizationGuard)
  @Mutation(() => Purchase)
  async createPurchase(
    @Args('data') data: CreatePurchaseInput,
    @CurrentUser() user: AuthUser,
  ) {
    const { productId } = data;
    const { sub: authUserId } = user;

    let customer = await this.customersService.getCustomerByAuthUserId(
      authUserId,
    );

    if (!customer) {
      customer = await this.customersService.createCustomer({ authUserId });
    }

    return this.purchasesService.createPurchase({
      productId,
      customerId: customer.id,
    });
  }
}
