import {ValidationError} from "../../errors/validation-error";
import ValidatorRules from "../validator-rules";

type Values = {
    value: any;
    property: string;
}

type ExpectedRule = {
    value: any;
    property: string;
    rule: keyof ValidatorRules;
    error: ValidationError;
    params?: any[];
}

function assertIsInvalid(expected: ExpectedRule) {
    expect(() => {
        runRule(expected);
    }).toThrow(expected.error);
}

function assertIsValid(expected: ExpectedRule) {
    expect(() => {
        runRule(expected);
    }).not.toThrow(expected.error);
}

function runRule({
    value,
    property,
    rule,
    params = []
}: Omit<ExpectedRule, "error">) {
    const validator = ValidatorRules.values(value, property);
    const method = validator[rule] as (...args: any[]) => ValidatorRules;
    method.apply(validator, params);
}

describe("ValidatorRules Unit Tests", () => {
    test("values methods", () => {
        const validator = ValidatorRules.values("some value", "field");
        expect(validator).toBeInstanceOf(ValidatorRules);
        expect(validator["value"]).toBe("some value");
        expect(validator["property"]).toBe("field");
    });

    test("requerid validation rule", () => {
        // casos inválidos
        let arrange: Values[] = [
            { value: null, property: "field" },
            { value: undefined, property: "field" },
            { value: "", property: "field" },
        ]

        const error = new ValidationError("The field is required");

        arrange.forEach(item => {
            assertIsInvalid({
                value: item.value,
                property: item.property,
                rule: "required",
                error,
            });
        });

        // casos válidos
        arrange = [
            { value: "test", property: "field" },
            { value: 5, property: "field" },
            { value: 0, property: "field" },
        ]

        arrange.forEach(item => {
            assertIsValid({
                value: item.value,
                property: item.property,
                rule: "required",
                error,
            });
        });
    });

    test("string validation rule", () => {
        // casos inválidos
        let arrange: Values[] = [
            { value: 5, property: "field" },
            { value: {}, property: "field" },
            { value: false, property: "field" },
        ]

        const error = new ValidationError("The field must be a string");

        arrange.forEach(item => {
            assertIsInvalid({
                value: item.value,
                property: item.property,
                rule: "string",
                error,
            })
        });

        // casos válidos
        arrange = [
            { value: null, property: "field" },
            { value: undefined, property: "field" },
            { value: "test", property: "field" },
        ]

        arrange.forEach(item => {
            assertIsValid({
                value: item.value,
                property: item.property,
                rule: "string",
                error,
            });
        });
    });

    test("maxLength validation rule", () => {
        // casos inválidos
        let arrange: Values[] = [
            { value: "aaaaaa", property: "field" },
        ]

        const error = new ValidationError("The field must be less or equal than 5 characters");

        // casos inválidos
        arrange.forEach(item => {
            assertIsInvalid({
                value: item.value,
                property: item.property,
                rule: "maxLength",
                error,
                params: [5],
            });
        });

        // casos válidos
        arrange = [
            { value: null, property: "field" },
            { value: undefined, property: "field" },
            { value: "aaaaa", property: "field" },
        ]

        // casos válidos
        arrange.forEach(item => {
            assertIsValid({
                value: item.value,
                property: item.property,
                rule: "maxLength",
                error,
                params: [5],
            });
        });
    });

    test("boolean validation rule", () => {
        // casos inválidos
        let arrange: Values[] = [
            { value: 5, property: "field" },
            { value: "true", property: "field" },
            { value: "false", property: "field" },
        ]

        const error = new ValidationError("The field must be a boolean");

        // casos inválidos
        arrange.forEach(item => {
            assertIsInvalid({
                value: item.value,
                property: item.property,
                rule: "boolean",
                error,
                params: [5],
            });
        });

        // casos válidos
        arrange = [
            { value: null, property: "field" },
            { value: undefined, property: "field" },
            { value: false, property: "field" },
            { value: true, property: "field" },
        ]

        arrange.forEach(item => {
            assertIsValid({
                value: item.value,
                property: item.property,
                rule: "boolean",
                error,
            });
        });
    });

    test("should throw a validation error when combine two or more validation rules", () => {
        let validator = new ValidatorRules(null, "field");
        expect(() => {
            validator.required().string().maxLength(5);
        }).toThrow(new ValidationError("The field is required"))

        validator = new ValidatorRules(5, "field");
        expect(() => {
            validator.required().string().maxLength(5);
        }).toThrow(new ValidationError("The field must be a string"))

        validator = new ValidatorRules("123456", "field");
        expect(() => {
            validator.required().string().maxLength(5);
        }).toThrow(new ValidationError("The field must be less or equal than 5 characters"))

        validator = new ValidatorRules(null, "field");
        expect(() => {
            validator.required().boolean();
        }).toThrow(new ValidationError("The field is required"))

        validator = new ValidatorRules(5, "field");
        expect(() => {
            validator.required().boolean();
        }).toThrow(new ValidationError("The field must be a boolean"))
    });

    test("should valid when combine two or more validation rules", () => {
        expect.assertions(0);

        ValidatorRules.values("test", "field").required().string();
        ValidatorRules.values("12345", "field").required().string().maxLength(5);

        ValidatorRules.values(true, "field").required().boolean();
        ValidatorRules.values(false, "field").required().boolean();
    });
});
