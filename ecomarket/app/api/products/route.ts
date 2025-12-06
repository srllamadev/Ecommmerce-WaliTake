import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const city = searchParams.get("city")

    const skip = (page - 1) * limit

    const where: any = {
      status: "available"
    }

    if (category) where.category = category
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    }
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) }
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) }
    if (city) where.location = { contains: city }

    const products = await prisma.product.findMany({
      where,
      include: {
        seller: {
          select: { id: true, name: true, businessName: true, location: true }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }
    })

    const total = await prisma.product.count({ where })

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const {
      title,
      description,
      price,
      quantity,
      unit,
      category,
      condition,
      images,
      location
    } = await request.json()

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        unit,
        category,
        condition,
        images,
        location: JSON.stringify(location),
        sellerId: session.user.id
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("id")

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    // Check if product exists and belongs to user
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    if (product.sellerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this product" },
        { status: 403 }
      )
    }

    await prisma.product.delete({
      where: { id: productId }
    })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Product deletion error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("id")

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    // Check if product exists and belongs to user
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    if (product.sellerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to edit this product" },
        { status: 403 }
      )
    }

    const {
      title,
      description,
      price,
      quantity,
      unit,
      category,
      condition,
      images,
      location
    } = await request.json()

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        unit,
        category,
        condition,
        images,
        location: JSON.stringify(location)
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Product update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}