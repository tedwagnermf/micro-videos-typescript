import { create } from "lodash";
import Category from "../../domain/entities/category";
import { CategoryOutputMapper } from "./category-output";

describe("CategoryOutputMapper Unit Tests", () => {
  it("should convert a Category in output", () => {
    const created_at = new Date();
    const entity = new Category({
      name: "Movie",
      description: "some description",
      is_active: true,
      created_at: created_at,
    });

    const spyTOJSON = jest.spyOn(entity, "toJSON");
    const output = CategoryOutputMapper.toOutput(entity);
    expect(spyTOJSON).toHaveBeenCalled();
    expect(output).toStrictEqual({
      id: entity.id,
      name: "Movie",
      description: "some description",
      is_active: true,
      created_at,
    });
  });
});
