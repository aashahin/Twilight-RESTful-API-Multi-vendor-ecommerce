class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  filter() {
    const storageQuery = { ...this.queryString };
    const excludesQuery = ["page", "limit", "sort", "fields", "keyword"];
    excludesQuery.forEach((i) => delete storageQuery[i]);
    let queryStr = JSON.stringify(storageQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    const sorting = this.queryString.sort
      ? this.queryString.sort.split(",").join(" ")
      : { createdAt: -1 };
    this.mongooseQuery = this.mongooseQuery.sort(sorting);
    return this;
  }
  limitFields() {
    const fields = this.queryString.fields
      ? this.queryString.fields.split(",").join(" ")
      : {};
    this.mongooseQuery = this.mongooseQuery.select(fields);
    return this;
  }
  paginate(count) {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 8;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    let pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(count / limit);
    if (endIndex < count) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.previous = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.pagination = pagination;
    return this;
  }
  search(modelName) {
    const searchProducts = this.queryString.keyword
      ? {
          $or: [
            { title: { $regex: this.queryString.keyword, $options: "i" } },
            {
              description: { $regex: this.queryString.keyword, $options: "i" },
            },
          ],
        }
      : {};
    const searchOther = this.queryString.keyword
      ? {
          $or: [{ name: { $regex: this.queryString.keyword, $options: "i" } }],
        }
      : {};
    const search = modelName ? searchProducts : searchOther;
    this.mongooseQuery = this.mongooseQuery.find(search);
    return this;
  }
  select() {
    const select = "-__v";
    this.mongooseQuery = this.mongooseQuery.select(select);
    return this;
  }
}
module.exports = ApiFeatures;
