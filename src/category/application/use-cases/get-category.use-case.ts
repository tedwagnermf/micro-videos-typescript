import CategoryRepository from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output";
import UseCase from "../../../@seedwork/application/use-cases";

export default class GetCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepository: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepository.findById(input.id);
    
    return CategoryOutputMapper.toOutput(entity);
  }
}

export type Input = {
  id: string;
};

export type Output = CategoryOutput;
