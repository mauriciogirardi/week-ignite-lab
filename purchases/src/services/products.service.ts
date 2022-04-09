import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

import { PrismaService } from 'src/database/prisma/prisma.service';

interface CreateProductParams {
  title: string;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  listAllProducts() {
    return this.prisma.product.findMany();
  }

  getProductById(id: string) {
    return this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  async createProduct({ title }: CreateProductParams) {
    const slug = slugify(title, { lower: true });

    const productWithSomeSlug = await this.prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (productWithSomeSlug) {
      throw new Error('Another product with some slug already exists.');
    }

    return this.prisma.product.create({
      data: {
        slug,
        title,
      },
    });
  }
}
