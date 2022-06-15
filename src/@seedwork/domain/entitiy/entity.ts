import UniqueEntityId from "../value-objects/unique-entity-id.vo"

export default abstract class Entity<Props = any> {
    public readonly uniqueEntityId: UniqueEntityId;

    constructor(public readonly props: Props, Id?: UniqueEntityId) {
        this.uniqueEntityId = Id || new UniqueEntityId(); // aqui há uma quebra de limite arquitetutal porque a entidade tá dependendo de uma biblioteca
    }

    get id(): string{
        return this.uniqueEntityId.value;
    }

    toJSON(): Required<{id: string} & Props> {
        return {
            id: this.id,
            ...this.props
        } as Required<{id: string} & Props>
    }
}