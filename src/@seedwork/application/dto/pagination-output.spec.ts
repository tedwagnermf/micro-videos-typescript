import Category from "../../../category/domain/entities/category";
import { SearchResult } from "../../../@seedwork/domain/repository/respository-contracts";
import { PaginationOutputMapper } from "../../../@seedwork/application/dto/pagination-output";

describe("PaginationOutputMapper Unit Tests", () => {
  it("should convert a SearchResult in output", () => {
    const result = new SearchResult({
      items: ["fake"] as any,
      total: 1,
      current_page: 1,
      per_page: 1,
      sort: "name",
      sort_dir: "desc",
      filter: "fake",
    });

    const output = PaginationOutputMapper.toOutput(result);
    expect(output).toStrictEqual({
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 1,
    });
  });
});
