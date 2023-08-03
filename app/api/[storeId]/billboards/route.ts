import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  {params}: {params: {storeId: string}}
){
  try{
    const body = await req.json();
    const {label, imageUrl} = body;
    const {userId} = auth();
    if(!userId){
      return new NextResponse("No esta autenticado", { status: 401 })
    }
    if(!label){
      return new NextResponse("El titulo es requerido", { status: 400 })
    }

    if(!imageUrl){
      return new NextResponse("La imagen es requerido", { status: 400 })
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
    const billboard = await prismadb.billboard.create({
      data:{
        label,
        imageUrl,
        storeId: params.storeId,
      }
    })
    return NextResponse.json(billboard);
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
    if(!params.storeId){
      return new NextResponse("El Store es necesario para continuar", {status:400})
    }
    const billboards = await prismadb.billboard.findMany({
      where:
      {
        storeId: params.storeId
      }
    })
    return NextResponse.json(billboards);
  }catch(error){
    console.log('[BILLBOARDS_GET]',error);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}