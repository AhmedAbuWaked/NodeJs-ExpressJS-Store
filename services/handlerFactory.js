const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(ApiError(`No Document Found in this id: ${id}`, 404));
    }

    res.status(201).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // To Return New Object (After Update)
    );

    if (!document) {
      return next(
        new ApiError(`no Document for this id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findById(id);

    if (!document) {
      return next(new ApiError(`no Document for this id ${id}`, 404));
    }

    res.status(200).json({ data: document });
  });

exports.getAll = ({ Model, keywords }) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) filter = req.filterObj;

    const total = await Model.find({}).countDocuments();

    const apiFeature = new ApiFeatures(Model.find(filter), req.query)
      .pagination(total)
      .filter()
      .search(keywords)
      .sort()
      .limitFields();

    const { mongooseQuery, pagination } = apiFeature;

    const document = await mongooseQuery;

    res.status(200).json({
      results: document.length,
      ...pagination,
      data: document,
    });
  });
