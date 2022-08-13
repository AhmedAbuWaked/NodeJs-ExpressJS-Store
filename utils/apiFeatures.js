class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    let query = { ...this.queryString };

    ["sort", "fields", "keyword", "limit", "page"].forEach((element) => {
      delete query[element];
    });

    query = JSON.stringify(query);

    query = query.replace(/\b()gte|gt|lte|lt\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(query));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const selectedFields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery.select(selectedFields);
    } else {
      this.mongooseQuery.select("-__v");
    }

    return this;
  }

  search(keys) {
    if (this.queryString.keyword) {
      const q = {};

      q.$or = keys.map((key) => ({
        [key]: { $regex: this.queryString.keyword, $options: "i" },
      }));

      this.mongooseQuery.find(q);
    }
    return this;
  }

  pagination(total) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagonation Result
    const pagination = {};
    pagination.current_page = page;
    pagination.per_page = limit;
    pagination.total_pages = Math.ceil(total / limit);

    if (endIndex < total) {
      pagination.next_page = page + 1;
    }
    if (skip > 0) {
      pagination.prev_page = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.pagination = pagination;

    return this;
  }
}

module.exports = ApiFeatures;
