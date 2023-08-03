import prismadb from "@/lib/prismadb";

export const getProductStock = async (storeId: string) => {
  const salesCount = await prismadb.product.count({
    where: {
      storeId: storeId,
      isArchived: false,
    },
  });



  return salesCount;
};
