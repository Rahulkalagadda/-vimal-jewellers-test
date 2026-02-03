import { ComponentLoader } from "adminjs";
import path from "path";
const loader = new ComponentLoader();
const components = {
  DashboardComponent: loader.add(
    "DashboardComponent",
    path.resolve("./components/dashboard/dashboard.jsx")
  ),
  UploadSingleImage: loader.add(
    "UploadSingleImage",
    path.resolve("./components/common/single_image_upload.jsx")
  ),
  ViewSingleImage: loader.add(
    "ViewSingleImage",
    path.resolve("./components/common/view_single_image.jsx")
  ),
  CreateStringList: loader.add(
    "CreateStringList",
    path.resolve("./components/common/string_list.jsx")
  ),
  ViewStringList: loader.add(
    "ViewStringList",
    path.resolve("./components/common/string_list_view.jsx")
  ),
  DescriptionRichText: loader.add(
    "DescriptionRichText",
    path.resolve("./components/product/description_rich.jsx")
  ),
  KeyValueList: loader.add(
    "KeyValueList",
    path.resolve("./components/product/key_value.jsx")
  ),
  KeyValueView: loader.add(
    "KeyValueView",
    path.resolve("./components/product/key_value_view.jsx")
  ),
  UploadMultipleImage: loader.add(
    "UploadMultipleImage",
    path.resolve("./components/common/multiple_image_upload.jsx")
  ),
  SizeColorStock: loader.add(
    "SizeColorStock",
    path.resolve("./components/product/size_color_stock.jsx")
  ),
  SizeChart: loader.add(
    "SizeChart",
    path.resolve("./components/product/size_chart.jsx")
  ),
  MaterialsShow: loader.add(
    "MaterialsShow",
    path.resolve("./components/product/materials_show.jsx")
  ),
  MegaMenuShow: loader.add(
    "MegaMenuShow",
    path.resolve("./components/mega_menu/mega_menu_show.jsx")
  ),
  UploadVideo: loader.add(
    "UploadVideo",
    path.resolve("./components/common/upload_video.jsx")
  ),
  PriceBreakupList: loader.add(
    "PriceBreakupList",
    path.resolve("./components/product/price_breakup_list.jsx")
  ),
  VariantList: loader.add(
    "VariantList",
    path.resolve("./components/product/variant_list.jsx")
  ),
  OrderItems: loader.add(
    "OrderItems",
    path.resolve("./components/order/order_items.jsx")
  ),
  OrderAddress: loader.add(
    "OrderAddress",
    path.resolve("./components/order/order_address.jsx")
  ),
  UserOrders: loader.add(
    "UserOrders",
    path.resolve("./components/user/user_orders.jsx")
  ),
  LinksEditor: loader.add(
    "LinksEditor",
    path.resolve("./components/footer/links_editor.jsx")
  ),
  LinksShow: loader.add(
    "LinksShow",
    path.resolve("./components/footer/links_show.jsx")
  ),
};

export { loader, components };
