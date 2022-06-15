import Category from "./category";
describe("Category integration tests", () => {
  describe("create method", () =>{
    it("should be invalid when creating a category using name", () => {
      expect(() => new Category({ name: null })).toThrow("The name is required.");
      
      expect(() => new Category({ name: "" })).toThrow("The name is required.");
  
      expect(() => new Category({ name: 5 as any })).toThrow("The name must be a string.");
      
      expect(() => new Category({ name: "t".repeat(256) })).toThrow("The name exceeds the maximum lenght of 255.");
    });
    
    it("should be invalid when creating a category with wrong description", () => {
      expect(() => new Category({ 
        name: "valid", 
        description: 5 as any, 
      })).toThrow("The description must be a string.");
    });
    
    it("should be invalid when creating a category with wrong is_active", () => {
      expect(() => new Category({ 
        name: "valid", 
        is_active: "true" as any,
      })).toThrow("The is_active must be a boolean.");
    });

    it("should create a valid category", () => {
      expect.assertions(0);
      new Category({ name: "valid" }); //NOSONAR
      new Category({ name: "valid", description: "valid description" }); //NOSONAR
      new Category({ name: "valid", description: null }); //NOSONAR
      new Category({ name: "valid", description: "valid description", is_active: false }); // NOSONAR
      new Category({ name: "valid", description: null, is_active: true }); // NOSONAR
    });
  });

  describe("update method", () => {
    it("should be invalid when updating a category using name", () => {
      const category = new Category({ name: "valid" });
      expect(() => category.update(null, null)).toThrow("The name is required.");
      
      expect(() => category.update("", null)).toThrow("The name is required.");
  
      expect(() => category.update(5 as any, null)).toThrow("The name must be a string.");
      
      expect(() => category.update("t".repeat(256), null))
        .toThrow("The name exceeds the maximum lenght of 255.");
    });
    
    it("should be invalid when updating a category with wrong description", () => {
      const category = new Category({ name: "valid" });
      expect(() => category.update("valid", 5 as any)).toThrow("The description must be a string.");
    });

    it("should update a valid category", () => {
      expect.assertions(0);
      const category = new Category({ name: "valid" }); 
      category.update("valid", "valid description"); 
      category.update("valid", null);
    });
  });
});