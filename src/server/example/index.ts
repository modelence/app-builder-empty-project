import z from 'zod';
import { Module, ObjectId } from 'modelence/server';
import { dbExampleItems } from './db';

export default new Module('example', {
  stores: [dbExampleItems],
  
  queries: {
    getItem: async (args: unknown) => {
      const { itemId } = z.object({ itemId: z.string() }).parse(args);
      const exampleItem = await dbExampleItems.requireOne({ _id: new ObjectId(itemId) });
      return {
        title: exampleItem.title,
        createdAt: exampleItem.createdAt,
      };
    },
  },
});
