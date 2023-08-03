import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  {params}: {params: {storeId: string}}
){
  try{
    const body = await req.json();
    const {name, billboardId} = body;
    const {userId} = auth();
    if(!userId){
      return new NextResponse("No esta autenticado", { status: 401 })
    }
    if(!name){
      return new NextResponse("El titulo es requerido", { status: 400 })
    }
    if(!billboardId){
      return new NextResponse("La billboard es requerida", { status: 400 })
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

    const category = await prismadb.category.create({
      data:{
        name,
        billboardId,
        storeId: params.storeId,
      }
    })
    return NextResponse.json(category);
  }catch(error){
    console.log('[CATEGORY_CREATE]',error);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(
  req: Request,
  {params}: {params: {storeId: string}}
){
  try{
    if(!params.storeId){
      return new NextResponse("El Store es necesario para continuar", {status:400})
    }
    const categories = await prismadb.category.findMany({
      where:
      {
        storeId: params.storeId
      }
    })
    return NextResponse.json(categories);
  }catch(error){
    console.log('[CATEGORIES_GET]',error);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}