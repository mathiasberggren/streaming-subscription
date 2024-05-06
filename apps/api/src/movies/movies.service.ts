import { Injectable } from '@nestjs/common'

import { PrismaService } from '../database/prisma.service'

import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'

@Injectable()
export class MoviesService {
  constructor (private readonly db: PrismaService) {}
  async create (createMovieDto: CreateMovieDto) {
    const { movieTitles, ...movieData } = createMovieDto

    const movie = await this.db.movie.create({
      data: {
        ...movieData,
        movieTitles: {
          create: movieTitles.map((title) => ({
            title: title.title,
            language: title.language,
            image: title.image
          }))
        }
      },
      include: {
        movieTitles: true
      }
    })

    return movie
  }

  async findAll () {
    return await this.db.movie.findMany({
      include: {
        movieTitles: true
      }
    })
  }

  findOne (id: number) {
    return `This action returns a #${id} movie`
  }

  update (id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`
  }

  remove (id: number) {
    return `This action removes a #${id} movie`
  }
}
