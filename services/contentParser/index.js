const { csvToJson, jsonToCsv } = require("./csvParser");
const { getFieldsFromItems } = require("../utils/fieldUtils");

const toArray = (arr) => (Array.isArray(arr) ? arr : [arr]);

function getItemsFromContent({ data, type }) {
  switch (type) {
    case "text/csv":
    case "application/vnd.ms-excel": {
      return csvToJson(data);
    }

    case "application/json":
    default: {
      return toArray(JSON.parse(data));
    }
  }
}

function getContentFromItems({ items, type }) {
  switch (type) {
    case "text/csv":
    case "application/vnd.ms-excel": {
      const mappedItems = toArray(items);

      let responses =
        mappedItems.length > 0 && mappedItems[0].Responses.length > 0
          ? mappedItems[0].Responses
          : [];

      // const headers = getFieldsFromItems(mappedItems);
      const headers = getFieldsFromItems(mappedItems[0].Responses);

      if (mappedItems.length > 0)
        console.log({ items, mappedItems: mappedItems[0].Responses, headers });

      const data =
        // mappedItems
        responses.map((item) => jsonToCsv(item, headers)).join("\n");

      return `${headers.join()}\n${data}`;
    }

    case "application/json":
    default:
      return JSON.stringify(items);
  }
}

module.exports = {
  getItemsFromContent,
  getContentFromItems,
};
