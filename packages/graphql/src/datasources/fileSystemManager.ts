import fs from "fs";
import matterOrig, { Input, GrayMatterOption } from "gray-matter";
import type { DataSource, Settings, FMT } from "./datasource";
import path from "path";
import * as jsyaml from "js-yaml";
const FMT_BASE = ".forestry/front_matter/templates";
const SETTINGS_PATH = ".forestry/settings.yml";

export class FileSystemManager implements DataSource {
  rootPath: string;
  constructor(rootPath: string) {
    this.rootPath = rootPath;
  }
  getTemplate = async (
    _siteLookup: string,
    templateName: string
  ): Promise<FMT> => {
    return this.getData<FMT>(_siteLookup, FMT_BASE + "/" + templateName);
  };
  getSettings = async (_siteLookup: string): Promise<Settings> => {
    return this.getData<Settings>(_siteLookup, SETTINGS_PATH);
  };
  getData = async <T>(_siteLookup: string, relPath: string): Promise<T> => {
    const result = matter(await fs.readFileSync(this.getFullPath(relPath)));
    // @ts-ignore
    return result;
  };

  writeData = async <ContentType>(
    _siteLookup: string,
    filepath: string,
    content: string,
    data: Partial<ContentType>
  ) => {
    const string = stringify(content, data);

    const fullPath = this.getFullPath(filepath);
    await fs.writeFileSync(fullPath, string);

    return await this.getData<ContentType>(_siteLookup, filepath);
  };

  fileExists = async (fullPath: string): Promise<boolean> => {
    return fs.promises
      .access(fullPath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);
  };

  deleteData = async (filePath: string) => {
    const fullPath = this.getFullPath(filePath);

    if (!(await this.fileExists(fullPath)))
      throw new Error(`Cannot delete ${fullPath}: Does not exist.`);
    fs.unlinkSync(fullPath);

    // TODO: Delete things from pages arrays
    return !(await this.fileExists(fullPath));
  };

  createContent = async <ContentType>(
    _siteLookup: string,
    filepath: string,
    content: string,
    data: Partial<ContentType>,
    templateName: string
  ) => {
    const newContent = await this.writeData<ContentType>(
      _siteLookup,
      filepath,
      content,
      data
    );

    let template = await this.getTemplate(_siteLookup, templateName);

    template.data.pages.push(filepath.replace(/^\/+/, ""));
    await this.writeTemplate(_siteLookup, templateName, template);
    return newContent;
  };

  deleteContent = async (_siteLookup: string, filePath: string) => {
    // delete the file
    await this.deleteData(filePath);
    // delete the stuff from pages
    return Promise.resolve(true);
  };

  getTemplateList = async (_siteLookup: string) => {
    const list = await fs.readdirSync(this.getFullPath(FMT_BASE));

    return list;
  };

  private writeTemplate = async (
    _siteLookup: string,
    templateName: string,
    template: FMT
  ): Promise<void> => {
    const string = "---\n" + jsyaml.dump(template.data);
    await fs.writeFileSync(FMT_BASE + "/" + templateName, string);
  };

  private getFullPath(relPath: string) {
    return path.join(this.rootPath, relPath);
  }
}

const stringify = (content: string, data: object) => {
  return matterOrig.stringify(content, data, {
    // @ts-ignore
    lineWidth: -1,
    noArrayIndent: true,
  });
};

const matter = <I extends Input, O extends GrayMatterOption<I, O>>(
  data: Buffer
) => {
  let res;
  res = matterOrig(data, { excerpt_separator: "<!-- excerpt -->" });

  return res;
};
