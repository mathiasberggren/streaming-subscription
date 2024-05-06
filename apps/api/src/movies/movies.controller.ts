import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'

import { Movie } from './entities/movie.entity'
import { MoviesService } from './movies.service'
import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { MoviesSearchService } from './movies-search/movies-search.service'

@ZodSerializerDto(Movie)
@Controller('movies')
export class MoviesController {
  constructor (private readonly moviesService: MoviesService, private readonly movieSearchService: MoviesSearchService) {}

  @Get('search')
  async findByTitle (@Query('title') title: string): Promise<Movie[]> {
    return await this.movieSearchService.findByTitle(title)
  }

  /**
   * RESTful API endpoints
   */

  @Post()
  async create (@Body() createMovieDto: CreateMovieDto) {
    return await this.moviesService.create(createMovieDto)
  }

  @Get()
  findAll () {
    return this.moviesService.findAll()
  }

  @Get(':id')
  findOne (@Param('id') id: string) {
    return this.moviesService.findOne(+id)
  }

  @Patch(':id')
  update (@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto)
  }

  @Delete(':id')
  remove (@Param('id') id: string) {
    return this.moviesService.remove(+id)
  }
}
