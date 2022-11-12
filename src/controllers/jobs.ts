import { NextFunction, Request, Response } from "express";
import axios from "axios";
import DataReturnHelper from "../helpers/data-return";
import logging from "../config/logging";
import config from "../config/config";

const NAMESPACE = "JobsController";

export default class JobsController {
  static JOBS_ENDPOINT = config.api.externals.job_list;
  static JOB_DETAIL_ENDPOINT = config.api.externals.job_detail;

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    const inputs: IJobsControllerGetAllInput | any = req.query;

    const params: IJobsControllerGetAllInput = {
      description: inputs["description"],
      location: inputs["location"],
      fulltime: inputs["fulltime"],
      page: inputs["page"],
    };

    try {
      const data = (
        await axios.get(JobsController.JOBS_ENDPOINT, { params: params })
      ).data;

      return res
        .status(200)
        .json(
          new DataReturnHelper(
            true,
            "Retrieved Jobs List Successful",
            data,
            params.page ?? 0
          )
        );
    } catch (err: any) {
      logging.error(NAMESPACE, err.message, err);
      return res.status(500).json(new DataReturnHelper().setToFailed(err));
    }
  }

  public static async getOne(req: Request, res: Response, next: NextFunction) {
    const id = req.params["id"];

    if (id === undefined || id === null) {
      return res.status(500).json({
        message: "Failed to Retrieve Data. ID is undefined.",
      });
    }

    try {
      const data = (
        await axios.get(JobsController.JOB_DETAIL_ENDPOINT + `/${id}`)
      ).data;

      if (Object.keys(data).length === 0) {
        return res
          .status(404)
          .json(new DataReturnHelper(true, "Job Detail Not Found"));
      }

      return res
        .status(200)
        .json(
          new DataReturnHelper(true, "Retrieved Job Detail Successful", data)
        );
    } catch (err: any) {
      return res.status(500).json(err);
    }
  }
}

interface IJobsControllerGetAllInput {
  description?: string;
  location?: string;
  fulltime?: boolean;
  page?: number;
}
