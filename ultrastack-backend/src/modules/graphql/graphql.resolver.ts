import { Resolver, Query, Mutation, Args, ObjectType, Field, InputType, ID } from '@nestjs/graphql'; // Added ID import
import { GraphqlService } from './graphql.service';

/**
 * ObjectType defines the structure of the data returned by the API.
 */
@ObjectType('Item')
class GraphqlItem {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;
}

/**
 * InputType defines the structure of arguments for mutations.
 */
@InputType()
class CreateItemInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
class UpdateItemInput {
  @Field(() => ID) // Changed from Int to ID to support large numbers (Date.now())
  id!: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}

@Resolver(() => GraphqlItem)
export class GraphqlResolver {
  constructor(private readonly graphqlService: GraphqlService) {}

  @Query(() => [GraphqlItem], { name: 'items' })
  async getItems() {
    return this.graphqlService.findAll();
  }

  @Query(() => GraphqlItem, { name: 'item', nullable: true })
  async getItem(@Args('id', { type: () => ID }) id: number) { // Changed type to ID
    return this.graphqlService.findOneById(id);
  }

  @Mutation(() => GraphqlItem)
  async createItem(@Args('createItemInput') input: CreateItemInput) {
    return this.graphqlService.create(input.name, input.description);
  }

  @Mutation(() => GraphqlItem)
  async updateItem(@Args('updateItemInput') input: UpdateItemInput) {
    return this.graphqlService.update(input.id, input.name, input.description);
  }

  @Mutation(() => Boolean)
  async removeItem(@Args('id', { type: () => ID }) id: number) { // Changed type to ID
    return this.graphqlService.remove(id);
  }
}