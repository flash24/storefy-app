import { v4 as UUID } from "uuid";

// Interfaces
interface IProps {
  id?: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
}

interface IProductterface extends IProps {
  timestamp: number;
}

export default class ProductModel {
  private _id: string;
  private _name: string;
  private _sku: string;
  private _description: string;
  private _price: number;
  private _stock: number;

  constructor({
    id = UUID(),
    name = "",
    sku = "",
    description = "",
    price = 0,
    stock = 0,
  }: IProps) {
    this._id = id;
    this._name = name;
    this._sku = sku;
    this._description = description;
    this._price = price;
    this._stock = stock;
  }

  /**
   * Set Id
   * @param value
   */
  setId(value: string): void {
    this._id = value !== "" ? value : null;
  }

  /**
   * Get Id
   * @return {string|*}
   */
  getId(): string {
    return this._id;
  }

  /**
   * Set Name
   * @param value
   */
  setName(value: string): void {
    this._name = value !== "" ? value : null;
  }

  /**
   * Get Name
   * @return {string|*}
   */
  getName(): string {
    return this._name;
  }

  /**
   * Set Sku
   * @param value
   */
  setSku(value: string): void {
    this._sku = value !== "" ? value : null;
  }

  /**
   * Get sku
   * @return {string|*}
   */
  getSku(): string {
    return this._sku;
  }

  /**
   * Set Description
   * @param value
   */
  setDescription(value: string): void {
    this._description = value !== "" ? value : null;
  }

  /**
   * Get description
   * @return {string|*}
   */
  getDescription(): string {
    return this._description;
  }

  /**
   * Set Price
   * @param value
   */
  setPrice(value: number): void {
    this._price = value > 0 ? value : null;
  }

  /**
   * Get description
   * @return {number|*}
   */
  getPrice(): number {
    return this._price;
  }

  /**
   * Set stock
   * @param value
   */
  setStock(value: number): void {
    this._stock = value > 0 ? value : null;
  }

  /**
   * Get stock
   * @return {number|*}
   */
  getStock(): number {
    return this._stock;
  }

  /**
   * Get Base entity mappings
   * @return {IProductterface}
   */
  getEntityMappings(): IProductterface {
    return {
      id: this.getId(),
      name: this.getName(),
      sku: this.getSku(),
      description: this.getDescription(),
      price: this.getPrice(),
      stock: this.getStock(),
      timestamp: new Date().getTime(),
    };
  }
}
