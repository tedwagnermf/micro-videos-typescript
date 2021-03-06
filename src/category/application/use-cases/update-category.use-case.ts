import Category from "../../domain/entities/category";
import {CategoryRepository} from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output";
import UseCase from "../../../@seedwork/application/use-cases";

export default class UpdateCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepository: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepository.findById(input.id);
    await this.categoryRepository.insert(entity);
    entity.update(input.name, input.description);

    if (input.is_active === true) {
      entity.activate();
    } 
    if (input.is_active === false) {
      entity.deactivate();
    } 
    await this.categoryRepository.update(entity);
    
    return CategoryOutputMapper.toOutput(entity);
  }
}

export type Input = {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
};

export type Output = CategoryOutput;
