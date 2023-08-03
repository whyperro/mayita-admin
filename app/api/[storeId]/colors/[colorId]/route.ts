
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {params}: {params: { colorId: string}}
){
  try{
    if(!params.colorId){
      return new NextResponse("Es necesario el ID de la categoria", {status: 400})
    }
    const color = await prismadb.color.findUnique({
      where:
      {
        id: params.colorId,
      }
    })
    return NextResponse.json(color);
  }catch(error){
    console.log('[CATEGORY_GET]',error);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PATCH (
  req: Request, 
  { params }: {params: {storeId: string, colorId: string}}
) {
  try{
    const {userId} = auth();
    const body = await req.json();

    const {name, value} = body; 

    if(!userId) {
      return new NextResponse('No esta autenticado...', {status: 400})
    }

    if(!params.storeId){
      return new NextResponse("El ID de la STORE es requerido", {status: 400})
    }

    if(!name){
      return new NextResponse("El nombre es requerido", {status:400})
    }

    if(!params.colorId){
      return new NextResponse("El ID de la talla es requerido", {status:400})
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

    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data:{
        name, 
        value,
      }
    })

    return NextResponse.json(color)
    
  }catch(error){
    console.log('[COLOR_PATCH]', error)
    return new NextResponse('Internal error', {status: 500})
  }
}

export async function DELETE (
  req: Request, 
  { params }: {params: {storeId: string, colorId: string}}
) {
  try{
    const {userId} = auth();

    if(!userId) {
      return new NextResponse('No esta autenticado...', {status: 400})
    }


    if(!params.storeId){
      return new NextResponse("El ID de la tienda es requerido", {status: 400})
    }

    if(!params.colorId){
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

    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      }
    })

    return NextResponse.json(color)
    
  }catch(error){
    console.log('[COLOR_DELETE]', error)
    return new NextResponse('Internal error', {status: 500})
  }
}

