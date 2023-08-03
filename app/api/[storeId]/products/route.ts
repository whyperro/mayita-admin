import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  {params}: {params: {storeId: string}}
){
  try{
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
    const {userId} = auth();
    if(!userId){
      return new NextResponse("No esta autenticado", { status: 401 })
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

    if(!params.storeId){
      return new NextResponse("El Store es necesario para continuar", {status:400})
    }
    const product = await prismadb.product.create({
      data:{
        name, 
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        storeId: params.storeId,

        images:{
          createMany: {
            data: [...images.map((image: {url: string})=> image)]
          }
        }
      }
    })
    return NextResponse.json(product);
  }catch(error){
    console.log('[BILLBOARDS_POST]',error);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(
  req: Request,
  {params}: {params: {storeId: string}}
){
  try{

    const {searchParams} = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");


    if(!params.storeId){
      return new NextResponse("El Store es necesario para continuar", {status:400})
    }
    const products = await prismadb.product.findMany({
      where:
      {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false
      },
      include:{
        images: true,
        color: true,
        size: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(products);
  }catch(error){
    console.log('[PRODUCTS_GET]',error);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}