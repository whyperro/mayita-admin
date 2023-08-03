import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import { NextResponse } from "next/server"

export async function PATCH (
  req: Request, 
  { params }: {params: {storeId: string}}
) {

  try{
    const {userId} = auth();
    const body = await req.json();

    const {name} = body; 

    if(!userId) {
      return new NextResponse('No esta autenticado...', {status: 400})
    }

    if(!name){
      return new NextResponse("El nombre es requerido", {status:400})
    }

    if(!params.storeId){
      return new NextResponse("El ID de la tienda es requerido", {status: 400})
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId
      },
      data:{
        name
      }
    })

    return NextResponse.json(store)
    
  }catch(error){
    console.log('[STORE PATCH', error)
    return new NextResponse('Internal error', {status: 500})
  }
}

export async function DELETE (
  req: Request, 
  { params }: {params: {storeId: string}}
) {
  try{
    const {userId} = auth();

    if(!userId) {
      return new NextResponse('No esta autenticado...', {status: 400})
    }


    if(!params.storeId){
      return new NextResponse("El ID de la tienda es requerido", {status: 400})
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId
      }
    })

    return NextResponse.json(store)
    
  }catch(error){
    console.log('[STORE DELETE', error)
    return new NextResponse('Internal error', {status: 500})
  }
}