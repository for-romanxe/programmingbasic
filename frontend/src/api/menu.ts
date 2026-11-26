import type { SectionModel } from "../util/menu";
import { request, serverMode } from "./client";
import { DemoMenuAPI } from "./demo";
export const MenuAPI = {
  ReadAllMenus: (): Promise<SectionModel[]> =>
    serverMode ? request("/menus") : DemoMenuAPI.ReadAllMenus(),
};
