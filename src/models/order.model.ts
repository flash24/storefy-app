import { v4 as UUID } from "uuid";

// Interfaces
interface IProps {
  id?: string;
  items: [];
  date: Date;
  status: string;
}

interface IOrderInterface extends IProps {
  timestamp: number;
}

export default class OrderModel {
  private _id: string;
  private _items: [];
  private _date: Date;
  private _status: any;

  constructor({
    id = UUID(),
    items = [],
    date = new Date(),
    status = "",
  }: IProps) {
    this._id = id;
    this._items = items;
    this._date = date;
    this._status = status;
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
   * Set Items
   * @param value
   */
  setItems(value: []): void {
    this._items = value.length > 0 ? value : [];
  }

  /**
   * Get Items
   * @return {sarray|*}
   */
  getItems(): [] {
    return this._items;
  }

  /**
   * Set Date
   * @param value
   */
  setDate(value: Date): void {
    this._date = value !== null ? value : new Date();
  }

  /**
   * Get Date
   * @return {Date|*}
   */
  getDate(): Date {
    return this._date;
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
  getEntityMappings(): IOrderInterface {
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
