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
        movieTitle: {
          create: movieTitles.map((title) => ({
            title: title.title,
            language: title.language
          }))
        }
      },
      include: {
        movieTitle: true
      }
    })

    return movie
  }

  findAll () {
    return 'This action returns all movies'
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
