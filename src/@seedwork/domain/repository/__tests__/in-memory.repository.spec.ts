import exp from "constants";
import Entity from "../../entitiy/entity";
import NotFoundError from "../../errors/not-found.error";
import {InMemoryRepository} from "../in-memory.repository";
import UniqueEntityId from "../../value-objects/unique-entity-id.vo";

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe("InMemoryRepository Unit Tests", () => {
  let repository = new StubInMemoryRepository();

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  // insert ********************************************************************************************************
  it("Should insert a new entity", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repository.insert(entity);
    expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  // update ********************************************************************************************************
  it("should throws error on update when entity not found", () => {
    const entity = new StubEntity({ name: "name value", price: 5 });

    expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity no found using ID ${entity.id}`)
    );
  });

  it("should updates a entity", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repository.insert(entity);

    const entityUpdate = new StubEntity(
      { name: "updated", price: 1 },
      entity.uniqueEntityId
    );
    await repository.update(entityUpdate);

    expect(entityUpdate.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  // delete ********************************************************************************************************
  it("should throws error on delete when entity not found", () => {
    expect(repository.delete("fake id")).rejects.toThrow(
      new NotFoundError("Entity no found using ID fake id")
    );

    expect(
      repository.delete(
        new UniqueEntityId("c6f9bab9-b5dd-42b5-a626-c7bf916a3c99")
      )
    ).rejects.toThrow(
      new NotFoundError(
        `Entity no found using ID c6f9bab9-b5dd-42b5-a626-c7bf916a3c99`
      )
    );
  });

  it("should delete a entity", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repository.insert(entity);

    await repository.delete(entity.id);
    expect(repository.items).toHaveLength(0);

    await repository.insert(entity);

    await repository.delete(entity.uniqueEntityId);
    expect(repository.items).toHaveLength(0);
});

  // find **********************************************************************************************************
  it("should throws error when entity not found", () => {
    expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError("Entity no found using ID fake id")
    );

    expect(
      repository.findById(
        new UniqueEntityId("c6f9bab9-b5dd-42b5-a626-c7bf916a3c99")
      )
    ).rejects.toThrow(
      new NotFoundError(
        `Entity no found using ID c6f9bab9-b5dd-42b5-a626-c7bf916a3c99`
      )
    );
  });

  it("Should finds an entity by id", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repository.insert(entity);

    let entitiyFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entitiyFound.toJSON());
  });

  // findAll *******************************************************************************************************
  it("should returns all entities", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repository.insert(entity);

    const entities = await repository.findByAll();

    expect(entities).toStrictEqual([entity]);
  });
});