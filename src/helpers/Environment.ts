import fs from "fs";
import path from "path";
import { AwsHelper, EnvironmentBase } from "@churchapps/apihelper";

export class Environment extends EnvironmentBase {
  static transcodePipeline: string;
  static transcodePreset: string;
  static ipGeoKey: string;
  static vimeoToken: string;
  static hubspotKey: string;

  static async init(environment: string) {
    let file = "dev.json";
    if (environment === "staging") file = "staging.json";
    if (environment === "prod") file = "prod.json";

    const relativePath = "../../config/" + file;
    const physicalPath = path.resolve(__dirname, relativePath);

    let data: Record<string, any> = {};
    try {
      const json = fs.readFileSync(physicalPath, "utf8");
      data = JSON.parse(json);
    } catch {
      console.log("Config file not found, using environment variables");
    }
    await this.populateBase(data, "lessonsApi", environment);

    this.transcodePipeline = process.env.TRANSCODE_PIPELINE || data.transcodePipeline;
    this.transcodePreset = process.env.TRANSCODE_PRESET || data.transcodePreset;
    this.hubspotKey = process.env.HUBSPOT_KEY || (await AwsHelper.readParameter(`/${environment}/hubspotKey`));
    this.ipGeoKey = process.env.IP_GEO_KEY || (await AwsHelper.readParameter(`/${environment}/ipGeoKey`));
    this.vimeoToken = process.env.VIMEO_TOKEN || (await AwsHelper.readParameter(`/${environment}/vimeoToken`));
  }
}
