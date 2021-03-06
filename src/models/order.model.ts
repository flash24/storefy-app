import { v4 as UUID } from "uuid";
import { Status } from "../enums/order.enum";
// Interfaces
interface IProps {
  id?: string;
  items: [];
  date: string;
  status: Status;
}

interface IOrderInterface extends IProps {
  timestamp: number;
}

export default class OrderModel {
  private _id: string;
  private _items: [];
  private _date: Date;
  private _status: Status;

  constructor({
    id = UUID(),
    items = [],
    date = new Date().toDateString(),
    status = Status.PENDING,
  }: IProps) {
    this._id = id;
    this._items = items;
    this._date = new Date(date);
    this._status = Status[status];
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
  setDate(value: string): void {
    this._date = value !== "" ? new Date(value) : null;
  }

  /**
   * Get Date
   * @return {string|*}
   */
  getDate(): string {
    return this._date.toDateString();
  }

  /**
   * Set status
   * @param value
   */
  setStatus(value: string): void {
    this._status = value !== "" ? Status[value] : null;
  }

  /**
   * Get status
   * @return {Status|*}
   */
  getStatus(): Status {
    return this._status;
  }

  /**
   * Get Base entity mappings
   * @return {IProductterface}
   */
  getEntityMappings(): IOrderInterface {
    return {
      id: this.getId(),
      items: this.getItems(),
      date: this.getDate(),
      status: this.getStatus(),
      timestamp: new Date().getTime(),
    };
  }
}
