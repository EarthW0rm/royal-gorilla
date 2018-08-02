import { Validator } from "validator.ts/Validator";
import { IsIn, MaxNumber, MinNumber, Contains, IsInt, IsLength, IsEmail, IsFQDN, IsDate, Validate } from "validator.ts/decorator/Validation";

export default class MotorcyclesRequestModel {

    constructor(_id, _fabricante, _ano_fabricacao){
        this.id =_id;
        this.fabricante = _fabricante;
        this.ano_fabricacao = _ano_fabricacao;
    }

    @MaxNumber(100)
    @MinNumber(1)
    @IsInt()
    id: number

    @IsIn(['honda', 'yamanha', 'suzuki', 'kawazaki', 'Triumph', 'bmw'], { message: 'Nao trabalhamos com esse fabricante.'})
    fabricante: string

    @MinNumber((new Date()).getFullYear() - 5, { message: 'Nao trabalhamos com motos com mais de 5 anos.'})
    ano_fabricacao: number

    Validate() {
        const validator = new Validator();
        return validator.validate(this);
    }

}