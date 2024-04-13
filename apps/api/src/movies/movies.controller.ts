import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common'

import { MoviesService } from './movies.service'
import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { MoviesSearchService } from './movies-search.service'

@Controller('movies')
export class MoviesController {
  constructor (private readonly moviesService: MoviesService, private readonly movieSearchService: MoviesSearchService) {}

  @Get('search')
  // TODO: change return type to Movie[] when the entity is defined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findByTitle (@Query('title') title: string): Promise<any> {
    return await this.movieSearchService.findByTitle(title)
  }

  /**
   * RESTful API endpoints
   */

  @Post()
  async create (@Body() createMovieDto: CreateMovieDto) {
    if (createMovieDto.movieTitles.length === 0) {
      throw new BadRequestException('At least one movie title is required')
    }

    await this.moviesService.create(createMovieDto)

    return { message: 'Movie created successfully' }
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
