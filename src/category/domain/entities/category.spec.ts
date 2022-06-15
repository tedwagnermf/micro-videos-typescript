import { CategoryProperties } from "./category";
import Category from "./category";
import { omit } from "lodash";
//import UniqueEntityId from "#seedwork/domain/value-objects/unique-entity-id.vo";
import UniqueEntityId from "@seedwork/domain/value-objects/unique-entity-id.vo";

//import UniqueEntityId from "@/domain/value-objects/unique-entity-id.vo";

describe("Category unit tests", () => {
  beforeEach(() => {
    Category.validate = jest.fn();
  });

  test("constructor of category", () => {
    // Triple A Test - Arrange / Act / Assert
    let category = new Category({ name: "Movie" });
    let props = omit(category.props, "created_at");
    expect(Category.validate).toHaveBeenCalled();
    expect(props).toStrictEqual({
      name: "Movie",
      description: null,
      is_active: true,
    });
    expect(category.props.created_at).toBeInstanceOf(Date);

    let created_at = new Date();
    category = new Category({
      name: "Movie 2",
      description: "some description",
      is_active: false,
      created_at,
    });
    expect(category.props).toStrictEqual({
      name: "Movie 2",
      description: "some description",
      is_active: false,
      created_at,
    });

    category = new Category({
      name: "Movie 3",
      description: "description 3",
    });
    expect(category.props).toMatchObject({
      name: "Movie 3",
      description: "description 3",
    });

    category = new Category({
      name: "Movie 4",
      is_active: true,
    });
    expect(category.props).toMatchObject({
      name: "Movie 4",
      is_active: true,
    });

    created_at = new Date();
    category = new Category({
      name: "Movie 5",
      created_at,
    });
    expect(category.props).toMatchObject({
      name: "Movie 5",
      created_at,
    });
  });

  test("id field", () => {
    type CategoryData = { props: CategoryProperties; id?: UniqueEntityId };
    const data: CategoryData[] = [
      { props: { name: "Movie" } },
      { props: { name: "Movie 2" }, id: null },
      { props: { name: "Movie 3" }, id: undefined },
      { props: { name: "Movie 4" }, id: new UniqueEntityId() },
    ];

    data.forEach((i) => {
      const category = new Category(i.props, i.id as any);
      expect(category.id).not.toBeNull();
      expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    });
  });

  test("name prop", () => {
    const category = new Category({ name: "Movie" });
    expect(category.name).toBe("Movie");
  });

  test("description prop", () => {
    let category = new Category({ name: "Movie" });
    expect(category.description).toBeNull();

    category = new Category({
      name: "Movie 2",
      description: "some description",
    });
    expect(category.description).toBe("some description");

    category = new Category({
      name: "Movie 3",
    });
    category["description"] = "other description";
    expect(category.description).toBe("other description");

    category["description"] = undefined;
    expect(category.description).toBeNull();
  });

  test("is_active prop", () => {
    let category = new Category({ name: "Movie" });
    expect(category.is_active).toBeTruthy();

    category = new Category({ name: "Movie", is_active: true });
    expect(category.is_active).toBeTruthy();

    category = new Category({ name: "Movie", is_active: false });
    expect(category.is_active).toBeFalsy();
  });

  test("created_at prop", () => {
    let category = new Category({ name: "Movie" });
    expect(category.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    category = new Category({ name: "Movie", created_at });
    expect(category.created_at).toBe(created_at);
  });

  it("should activate category", () => {
    let category = new Category({ name: "Movie", is_active: false });
    category.activate();
    expect(category.is_active).toBeTruthy();
  });

  it("should deactivate category", () => {
    let category = new Category({ name: "Movie" });
    category.deactivate();
    expect(category.is_active).toBeFalsy();
  });

  it("should update entity", () => {
    let category = new Category({
      name: "Title Before",
      description: "Before update",
    });
    category.update("Title After", "After update");

    let props = omit(category.props, "created_at");
    expect(Category.validate).toHaveBeenCalledTimes(2);
    expect(props).toStrictEqual({
      name: "Title After",
      description: "After update",
      is_active: true,
    });
  });
});
