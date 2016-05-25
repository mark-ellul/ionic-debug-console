// adapted https://github.com/CoderAjay/ng2Draggable
import {Directive, ElementRef, Renderer, OnDestroy, OnInit} from '@angular/core';
import {DragGesture} from 'ionic-angular/gestures/drag-gesture';

@Directive({
  selector: '[button-draggable]'
})

export class ConsoleButtonDraggable extends DragGesture {
  private Δx: number = 0;
  private Δy: number = 0;
  dragGesture: DragGesture;

  constructor(
    private el: ElementRef, private renderer: Renderer
  ) {
    super(el.nativeElement);
    this.listen();
  }

  public ngOnInit(): void {
    this.renderer.setElementAttribute(this.el.nativeElement, 'draggable', 'true');
  }

  onDragStart(event) {
    if(event) {
      this.el.nativeElement.style.opacity = .5;
      this.Δx = event.changedPointers[0].pageX - this.el.nativeElement.offsetLeft - event.deltaX;
      this.Δy = event.changedPointers[0].pageY - this.el.nativeElement.offsetTop - event.deltaY;
    }
    return true;
  }

  onDrag(event) {
    if(event){
      this.doTranslation(event.changedPointers[0].pageX, event.changedPointers[0].pageY);
    }
    return true;
  }

  onDragEnd(event) {
    this.el.nativeElement.style.opacity = '';
    this.Δx = 0;
    this.Δy = 0;
  }

  doTranslation(x: number, y: number) {
    if (!x || !y) return;
    this.renderer.setElementStyle(this.el.nativeElement, 'top', (y - this.Δy) + 'px');
    this.renderer.setElementStyle(this.el.nativeElement, 'left', (x - this.Δx) + 'px');
  }

  public ngOnDestroy(): void { }

}
