import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["tn"];

  logger.info("Seeding M&A Collections store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "tnd",
          is_default: true,
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Tunisia",
          currency_code: "tnd",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "M&A Collections Warehouse",
          address: {
            city: "Kasserine",
            country_code: "TN",
            address_1: "ISSAT Kasserine",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Tunisia Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Tunisia",
        geo_zones: [
          {
            country_code: "tn",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Livraison en 3-5 jours ouvrables.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "tnd",
            amount: 7,
          },
          {
            region_id: region.id,
            amount: 7,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "M&A Collections Webshop",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product data...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Hommes",
          is_active: true,
        },
        {
          name: "Femmes",
          is_active: true,
        },
        {
          name: "T-Shirts",
          is_active: true,
        },
        {
          name: "Chemises",
          is_active: true,
        },
        {
          name: "Pantalons",
          is_active: true,
        },
        {
          name: "Vestes",
          is_active: true,
        },
      ],
    },
  });

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "T-Shirt Classique Homme",
          category_ids: [
            categoryResult.find((cat) => cat.name === "T-Shirts")!.id,
            categoryResult.find((cat) => cat.name === "Hommes")!.id,
          ],
          description:
            "Un t-shirt classique en coton premium pour un confort quotidien. Coupe moderne et élégante, parfait pour toutes les occasions.",
          handle: "t-shirt-classique-homme",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
            },
            {
              url: "https://images.unsplash.com/photo-1622445275576-721325763afe?w=800",
            },
          ],
          options: [
            {
              title: "Taille",
              values: ["S", "M", "L", "XL"],
            },
            {
              title: "Couleur",
              values: ["Noir", "Blanc", "Gris"],
            },
          ],
          variants: [
            {
              title: "S / Noir",
              sku: "MA-TSH-S-NOIR",
              options: { Taille: "S", Couleur: "Noir" },
              prices: [{ amount: 35, currency_code: "tnd" }],
            },
            {
              title: "S / Blanc",
              sku: "MA-TSH-S-BLANC",
              options: { Taille: "S", Couleur: "Blanc" },
              prices: [{ amount: 35, currency_code: "tnd" }],
            },
            {
              title: "S / Gris",
              sku: "MA-TSH-S-GRIS",
              options: { Taille: "S", Couleur: "Gris" },
              prices: [{ amount: 35, currency_code: "tnd" }],
            },
            {
              title: "M / Noir",
              sku: "MA-TSH-M-NOIR",
              options: { Taille: "M", Couleur: "Noir" },
              prices: [{ amount: 35, currency_code: "tnd" }],
            },
            {
              title: "M / Blanc",
              sku: "MA-TSH-M-BLANC",
              options: { Taille: "M", Couleur: "Blanc" },
              prices: [{ amount: 35, currency_code: "tnd" }],
            },
            {
              title: "M / Gris",
              sku: "MA-TSH-M-GRIS",
              options: { Taille: "M", Couleur: "Gris" },
              prices: [{ amount: 35, currency_code: "tnd" }],
            },
            {
              title: "L / Noir",
              sku: "MA-TSH-L-NOIR",
              options: { Taille: "L", Couleur: "Noir" },
              prices: [{ amount: 35, currency_code: "tnd" }],
            },
            {
              title: "L / Blanc",
              sku: "MA-TSH-L-BLANC",
              options: { Taille: "L", Couleur: "Blanc" },
              prices: [{ amount: 35, currency_code: "tnd" }],
            },
            {
              title: "L / Gris",
              sku: "MA-TSH-L-GRIS",
              options: { Taille: "L", Couleur: "Gris" },
              prices: [{ amount: 35, currency_code: "tnd" }],
            },
            {
              title: "XL / Noir",
              sku: "MA-TSH-XL-NOIR",
              options: { Taille: "XL", Couleur: "Noir" },
              prices: [{ amount: 35, currency_code: "tnd" }],
            },
            {
              title: "XL / Blanc",
              sku: "MA-TSH-XL-BLANC",
              options: { Taille: "XL", Couleur: "Blanc" },
              prices: [{ amount: 35, currency_code: "tnd" }],
            },
            {
              title: "XL / Gris",
              sku: "MA-TSH-XL-GRIS",
              options: { Taille: "XL", Couleur: "Gris" },
              prices: [{ amount: 35, currency_code: "tnd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "T-Shirt Élégant Femme",
          category_ids: [
            categoryResult.find((cat) => cat.name === "T-Shirts")!.id,
            categoryResult.find((cat) => cat.name === "Femmes")!.id,
          ],
          description:
            "Un t-shirt féminin au design élégant et moderne. Tissu doux et confortable pour un look raffiné au quotidien.",
          handle: "t-shirt-elegant-femme",
          weight: 180,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
            },
            {
              url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800",
            },
          ],
          options: [
            {
              title: "Taille",
              values: ["S", "M", "L"],
            },
            {
              title: "Couleur",
              values: ["Rose", "Noir", "Blanc"],
            },
          ],
          variants: [
            {
              title: "S / Rose",
              sku: "MA-TSF-S-ROSE",
              options: { Taille: "S", Couleur: "Rose" },
              prices: [{ amount: 39, currency_code: "tnd" }],
            },
            {
              title: "S / Noir",
              sku: "MA-TSF-S-NOIR",
              options: { Taille: "S", Couleur: "Noir" },
              prices: [{ amount: 39, currency_code: "tnd" }],
            },
            {
              title: "S / Blanc",
              sku: "MA-TSF-S-BLANC",
              options: { Taille: "S", Couleur: "Blanc" },
              prices: [{ amount: 39, currency_code: "tnd" }],
            },
            {
              title: "M / Rose",
              sku: "MA-TSF-M-ROSE",
              options: { Taille: "M", Couleur: "Rose" },
              prices: [{ amount: 39, currency_code: "tnd" }],
            },
            {
              title: "M / Noir",
              sku: "MA-TSF-M-NOIR",
              options: { Taille: "M", Couleur: "Noir" },
              prices: [{ amount: 39, currency_code: "tnd" }],
            },
            {
              title: "M / Blanc",
              sku: "MA-TSF-M-BLANC",
              options: { Taille: "M", Couleur: "Blanc" },
              prices: [{ amount: 39, currency_code: "tnd" }],
            },
            {
              title: "L / Rose",
              sku: "MA-TSF-L-ROSE",
              options: { Taille: "L", Couleur: "Rose" },
              prices: [{ amount: 39, currency_code: "tnd" }],
            },
            {
              title: "L / Noir",
              sku: "MA-TSF-L-NOIR",
              options: { Taille: "L", Couleur: "Noir" },
              prices: [{ amount: 39, currency_code: "tnd" }],
            },
            {
              title: "L / Blanc",
              sku: "MA-TSF-L-BLANC",
              options: { Taille: "L", Couleur: "Blanc" },
              prices: [{ amount: 39, currency_code: "tnd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Chemise Homme Formelle",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Chemises")!.id,
            categoryResult.find((cat) => cat.name === "Hommes")!.id,
          ],
          description:
            "Une chemise formelle de qualité supérieure. Coupe ajustée et finitions soignées pour un look professionnel impeccable.",
          handle: "chemise-homme-formelle",
          weight: 250,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800",
            },
            {
              url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800",
            },
          ],
          options: [
            {
              title: "Taille",
              values: ["S", "M", "L", "XL"],
            },
            {
              title: "Couleur",
              values: ["Blanc", "Bleu Ciel"],
            },
          ],
          variants: [
            {
              title: "S / Blanc",
              sku: "MA-CHF-S-BLANC",
              options: { Taille: "S", Couleur: "Blanc" },
              prices: [{ amount: 75, currency_code: "tnd" }],
            },
            {
              title: "S / Bleu Ciel",
              sku: "MA-CHF-S-BLEU",
              options: { Taille: "S", Couleur: "Bleu Ciel" },
              prices: [{ amount: 75, currency_code: "tnd" }],
            },
            {
              title: "M / Blanc",
              sku: "MA-CHF-M-BLANC",
              options: { Taille: "M", Couleur: "Blanc" },
              prices: [{ amount: 75, currency_code: "tnd" }],
            },
            {
              title: "M / Bleu Ciel",
              sku: "MA-CHF-M-BLEU",
              options: { Taille: "M", Couleur: "Bleu Ciel" },
              prices: [{ amount: 75, currency_code: "tnd" }],
            },
            {
              title: "L / Blanc",
              sku: "MA-CHF-L-BLANC",
              options: { Taille: "L", Couleur: "Blanc" },
              prices: [{ amount: 75, currency_code: "tnd" }],
            },
            {
              title: "L / Bleu Ciel",
              sku: "MA-CHF-L-BLEU",
              options: { Taille: "L", Couleur: "Bleu Ciel" },
              prices: [{ amount: 75, currency_code: "tnd" }],
            },
            {
              title: "XL / Blanc",
              sku: "MA-CHF-XL-BLANC",
              options: { Taille: "XL", Couleur: "Blanc" },
              prices: [{ amount: 75, currency_code: "tnd" }],
            },
            {
              title: "XL / Bleu Ciel",
              sku: "MA-CHF-XL-BLEU",
              options: { Taille: "XL", Couleur: "Bleu Ciel" },
              prices: [{ amount: 75, currency_code: "tnd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Pantalon Chino Homme",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Pantalons")!.id,
            categoryResult.find((cat) => cat.name === "Hommes")!.id,
          ],
          description:
            "Un pantalon chino élégant et confortable. Coupe moderne parfaite pour le bureau ou les sorties décontractées.",
          handle: "pantalon-chino-homme",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
            },
            {
              url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
            },
          ],
          options: [
            {
              title: "Taille",
              values: ["38", "40", "42", "44"],
            },
            {
              title: "Couleur",
              values: ["Beige", "Noir", "Bleu Marine"],
            },
          ],
          variants: [
            {
              title: "38 / Beige",
              sku: "MA-PCH-38-BEIGE",
              options: { Taille: "38", Couleur: "Beige" },
              prices: [{ amount: 89, currency_code: "tnd" }],
            },
            {
              title: "38 / Noir",
              sku: "MA-PCH-38-NOIR",
              options: { Taille: "38", Couleur: "Noir" },
              prices: [{ amount: 89, currency_code: "tnd" }],
            },
            {
              title: "38 / Bleu Marine",
              sku: "MA-PCH-38-BLEU",
              options: { Taille: "38", Couleur: "Bleu Marine" },
              prices: [{ amount: 89, currency_code: "tnd" }],
            },
            {
              title: "40 / Beige",
              sku: "MA-PCH-40-BEIGE",
              options: { Taille: "40", Couleur: "Beige" },
              prices: [{ amount: 89, currency_code: "tnd" }],
            },
            {
              title: "40 / Noir",
              sku: "MA-PCH-40-NOIR",
              options: { Taille: "40", Couleur: "Noir" },
              prices: [{ amount: 89, currency_code: "tnd" }],
            },
            {
              title: "40 / Bleu Marine",
              sku: "MA-PCH-40-BLEU",
              options: { Taille: "40", Couleur: "Bleu Marine" },
              prices: [{ amount: 89, currency_code: "tnd" }],
            },
            {
              title: "42 / Beige",
              sku: "MA-PCH-42-BEIGE",
              options: { Taille: "42", Couleur: "Beige" },
              prices: [{ amount: 89, currency_code: "tnd" }],
            },
            {
              title: "42 / Noir",
              sku: "MA-PCH-42-NOIR",
              options: { Taille: "42", Couleur: "Noir" },
              prices: [{ amount: 89, currency_code: "tnd" }],
            },
            {
              title: "42 / Bleu Marine",
              sku: "MA-PCH-42-BLEU",
              options: { Taille: "42", Couleur: "Bleu Marine" },
              prices: [{ amount: 89, currency_code: "tnd" }],
            },
            {
              title: "44 / Beige",
              sku: "MA-PCH-44-BEIGE",
              options: { Taille: "44", Couleur: "Beige" },
              prices: [{ amount: 89, currency_code: "tnd" }],
            },
            {
              title: "44 / Noir",
              sku: "MA-PCH-44-NOIR",
              options: { Taille: "44", Couleur: "Noir" },
              prices: [{ amount: 89, currency_code: "tnd" }],
            },
            {
              title: "44 / Bleu Marine",
              sku: "MA-PCH-44-BLEU",
              options: { Taille: "44", Couleur: "Bleu Marine" },
              prices: [{ amount: 89, currency_code: "tnd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Veste Légère Homme",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Vestes")!.id,
            categoryResult.find((cat) => cat.name === "Hommes")!.id,
          ],
          description:
            "Une veste légère et stylée pour les soirées fraîches. Design moderne avec finitions premium pour un look sophistiqué.",
          handle: "veste-legere-homme",
          weight: 500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
            },
            {
              url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800",
            },
          ],
          options: [
            {
              title: "Taille",
              values: ["M", "L", "XL"],
            },
            {
              title: "Couleur",
              values: ["Noir", "Bleu Marine"],
            },
          ],
          variants: [
            {
              title: "M / Noir",
              sku: "MA-VLH-M-NOIR",
              options: { Taille: "M", Couleur: "Noir" },
              prices: [{ amount: 120, currency_code: "tnd" }],
            },
            {
              title: "M / Bleu Marine",
              sku: "MA-VLH-M-BLEU",
              options: { Taille: "M", Couleur: "Bleu Marine" },
              prices: [{ amount: 120, currency_code: "tnd" }],
            },
            {
              title: "L / Noir",
              sku: "MA-VLH-L-NOIR",
              options: { Taille: "L", Couleur: "Noir" },
              prices: [{ amount: 120, currency_code: "tnd" }],
            },
            {
              title: "L / Bleu Marine",
              sku: "MA-VLH-L-BLEU",
              options: { Taille: "L", Couleur: "Bleu Marine" },
              prices: [{ amount: 120, currency_code: "tnd" }],
            },
            {
              title: "XL / Noir",
              sku: "MA-VLH-XL-NOIR",
              options: { Taille: "XL", Couleur: "Noir" },
              prices: [{ amount: 120, currency_code: "tnd" }],
            },
            {
              title: "XL / Bleu Marine",
              sku: "MA-VLH-XL-BLEU",
              options: { Taille: "XL", Couleur: "Bleu Marine" },
              prices: [{ amount: 120, currency_code: "tnd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Robe Casual Femme",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Femmes")!.id,
          ],
          description:
            "Une robe casual élégante pour un style décontracté chic. Tissu fluide et confortable, parfaite pour toutes les occasions.",
          handle: "robe-casual-femme",
          weight: 300,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
            },
            {
              url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
            },
          ],
          options: [
            {
              title: "Taille",
              values: ["S", "M", "L"],
            },
            {
              title: "Couleur",
              values: ["Noir", "Rouge", "Beige"],
            },
          ],
          variants: [
            {
              title: "S / Noir",
              sku: "MA-RCF-S-NOIR",
              options: { Taille: "S", Couleur: "Noir" },
              prices: [{ amount: 95, currency_code: "tnd" }],
            },
            {
              title: "S / Rouge",
              sku: "MA-RCF-S-ROUGE",
              options: { Taille: "S", Couleur: "Rouge" },
              prices: [{ amount: 95, currency_code: "tnd" }],
            },
            {
              title: "S / Beige",
              sku: "MA-RCF-S-BEIGE",
              options: { Taille: "S", Couleur: "Beige" },
              prices: [{ amount: 95, currency_code: "tnd" }],
            },
            {
              title: "M / Noir",
              sku: "MA-RCF-M-NOIR",
              options: { Taille: "M", Couleur: "Noir" },
              prices: [{ amount: 95, currency_code: "tnd" }],
            },
            {
              title: "M / Rouge",
              sku: "MA-RCF-M-ROUGE",
              options: { Taille: "M", Couleur: "Rouge" },
              prices: [{ amount: 95, currency_code: "tnd" }],
            },
            {
              title: "M / Beige",
              sku: "MA-RCF-M-BEIGE",
              options: { Taille: "M", Couleur: "Beige" },
              prices: [{ amount: 95, currency_code: "tnd" }],
            },
            {
              title: "L / Noir",
              sku: "MA-RCF-L-NOIR",
              options: { Taille: "L", Couleur: "Noir" },
              prices: [{ amount: 95, currency_code: "tnd" }],
            },
            {
              title: "L / Rouge",
              sku: "MA-RCF-L-ROUGE",
              options: { Taille: "L", Couleur: "Rouge" },
              prices: [{ amount: 95, currency_code: "tnd" }],
            },
            {
              title: "L / Beige",
              sku: "MA-RCF-L-BEIGE",
              options: { Taille: "L", Couleur: "Beige" },
              prices: [{ amount: 95, currency_code: "tnd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
  logger.info("M&A Collections store setup complete!");
}
