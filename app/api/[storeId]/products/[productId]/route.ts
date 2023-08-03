
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {params}: {params: { productId: string}}
){
  try{
    if(!params.productId){
      return new NextResponse("Es necesario el ID del producto", {status: 400})
    }
    const product = await prismadb.product.findUnique({
      where:
      {
        id: params.productId,
      },
      include:
      {
        images: true,
        category: true,
        size: true,
        color: true,
      }
    })
    return NextResponse.json(product);
  }catch(error){
    console.log('[PRODUCT_GET]',error);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PATCH (
  req: Request, 
  { params }: {params: {productId: string, storeId: string}}
) {
  try{
    const {userId} = auth();
    const body = await req.json();

    const {
      name, 
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived
    } = body;

    if(!userId) {
      return new NextResponse('No esta autenticado...', {status: 400})
    }

    if(!params.productId){
      return new NextResponse("El ID del producto es requerido", {status: 400})
    }

    if(!params.storeId){
      return new NextResponse("El ID de la store es requerido", {status: 400})
    }

    if(!name){
      return new NextResponse("El nombre es requerido", { status: 400 })
    }

    if(!price){
      return new NextResponse("El precio es requerido", { status: 400 })
    }
    if(!categoryId){
      return new NextResponse("La categoria es requerido", { status: 400 })
    }
    if(!sizeId){
      return new NextResponse("La talla es requerido", { status: 400 })
    }
    if(!colorId){
      return new NextResponse("El color es requerido", { status: 400 })
    }
    if(!images || !images.length){
      return new NextResponse("Las imagenes son requerido", { status: 400 })
    }


    const storeByUserId = prismadb.store.findFirst({
      where:
      {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId){
      return new NextResponse("No esta autorizado", {status: 403})
    }

    await prismadb.product.update({
      where: {
        id: params.productId,
        storeId: params.storeId,
      },
      data:{
        name, 
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {

          }
        },
        isFeatured,
        isArchived
      }
    })

    const product = await prismadb.product.update({
      where:{
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: {url: string}) => image)
            ]
          }
        }
      }
    })

    return NextResponse.json(product)
    
  }catch(error){
    console.log('[PRODUCT_PATCH]', error)
    return new NextResponse('Internal error', {status: 500})
  }
}

export async function DELETE (
  req: Request, 
  { params }: {params: {storeId: string, productId: string}}
) {
  try{
    const {userId} = auth();

    if(!userId) {
      return new NextResponse('No esta autenticado...', {status: 400})
    }


    if(!params.storeId){
      return new NextResponse("El ID de la tienda es requerido", {status: 400})
    }

    if(!params.productId){
      return new NextResponse("El ID del producto es requerida", {status: 400})
    }

    const storeByUserId = prismadb.store.findFirst({
      where:
      {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId){
      return new NextResponse("No esta autorizado", {status: 403})
    }

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      }
    })

    return NextResponse.json(product)
    
  }catch(error){
    console.log('[PRODUCT_DELETE]', error)
    return new NextResponse('Internal error', {status: 500})
  }
}

