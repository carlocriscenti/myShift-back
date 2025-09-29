import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly repo: Repository<Employee>,
  ) {}

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.repo.create(dto);
    return await this.repo.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.repo.findOneBy({ id });
    if (!employee) {
      throw new NotFoundException(`Employee con id ${id} non trovato`);
    }
    return employee;
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Employee con id ${id} non trovato`);
    }
  }
}
