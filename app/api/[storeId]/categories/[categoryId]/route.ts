
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {params}: {params: { categoryId: string}}
){
  try{
    if(!params.categoryId){
      return new NextResponse("Es necesario el ID de la categoria", {status: 400})
    }
    const category = await prismadb.category.findUnique({
      where:
      {
        id: params.categoryId,
      },
      include:
      {
        billboard: true
      }
    })
    return NextResponse.json(category);
  }catch(error){
    console.log('[CATEGORY_GET]',error);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PATCH (
  req: Request, 
  { params }: {params: {storeId: string, categoryId: string}}
) {
  try{
    const {userId} = auth();
    const body = await req.json();

    const {name, billboardId} = body; 

    if(!userId) {
      return new NextResponse('No esta autenticado...', {status: 400})
    }

    if(!params.storeId){
      return new NextResponse("El ID de la STORE es requerido", {status: 400})
    }

    if(!name){
      return new NextResponse("El nombre es requerido", {status:400})
    }

    if(!billboardId){
      return new NextResponse("La billboard es requerida", {status:400})
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

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data:{
        name, 
        billboardId
      }
    })

    return NextResponse.json(category)
    
  }catch(error){
    console.log('[BILLBOARD_PATCH]', error)
    return new NextResponse('Internal error', {status: 500})
  }
}

export async function DELETE (
  req: Request, 
  { params }: {params: {storeId: string, categoryId: string}}
) {
  try{
    const {userId} = auth();

    if(!userId) {
      return new NextResponse('No esta autenticado...', {status: 400})
    }


    if(!params.storeId){
      return new NextResponse("El ID de la tienda es requerido", {status: 400})
    }

    if(!params.categoryId){
      return new NextResponse("El ID de la billboard es requerida", {status: 400})
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

    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
        storeId: params.storeId,
      }
    })

    return NextResponse.json(category)
    
  }catch(error){
    console.log('[CATEGORY_DELETE]', error)
    return new NextResponse('Internal error', {status: 500})
  }
}

