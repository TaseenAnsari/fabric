import { Component, HostListener, OnInit } from '@angular/core';
import { fabric } from 'fabric'
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @HostListener('document:keyup', ['$event'])
  onClick(key: any) {
    if (key?.keyCode == 46) this.deleteObject()
  }
  canvas: any
  lineArray: any = []
  project: any
  board: any = {}
  selectedNode: any = []
  isLoading: boolean = false
  ProjectListSubs!: Subscription
  constructor(
  ) { }
  ngOnDestroy(): void {
    this.ProjectListSubs?.unsubscribe();
  }
  objectCount: number = 1
  ngOnInit(): void {
    // this.util.refreshSideNavBar$.next(true)
    // this.ProjectListSubs =  this.projectData.project$.subscribe((res: any) => {
    if (true) {
      this.isLoading = false
      this.canvas = new fabric.Canvas('canvas', {
        height: 600,
        width: 1275,
        enableRetinaScaling: true,
      });
      this.showGrid();
      this.canvas.on({
        'selection:created': (e: any) => { this.onObjectSelected(e) },
        'object:moving': (e: any) => { this.onObjectMoving(e) },
        'selection:cleared': (e: any) => { this.onSelectionCleared(e) },
        'mouse:down': (e: any) => { this.mouseDown(e) },
        'mouse:wheel': (e: any) => { this.Zoom(e) },
        'mouse:move': (e: any) => { this.mouseMove(e) },
        'mouse:up': (e: any) => { this.mouseUp(e) },
        'mouse:out': (e: any) => { if (e?.target?.name == 'node') e.target.set({ 'stroke': 'black', 'strokeWidth': 1 }); this.canvas.renderAll(); },
        'mouse:over': (e: any) => { if (e?.target?.name == 'node') e.target.set({ 'stroke': 'blue', 'strokeWidth': 3 }); this.canvas.renderAll(); }
        // 'object:modified': (e: any) => { this.updateBoard() }
      });
      this.board._id = 'afkdkjfadhfkjdashf'
      // this.board.json = this.canvas.toJSON();
      // this.project = res
      // this.getBoards()

    }

    // })

  }
  setupBoard() {

  }
  deleteObject() {
    this.canvas.remove(this.canvas.getActiveObject())
    // this.updateBoard()
  }

  mouseDown(opt: any) {
    var evt = opt.e;
    if (!opt?.target?.name) {
      if (this.selectedNode.length) {
        this.selectedNode.map((v: any) => this.canvas.remove(v))
      }
    }
    let activeObject: any = opt?.target
    if (evt.altKey === true) {
      this.canvas.isDragging = true;
      this.canvas.selection = false;
      this.canvas.lastPosX = evt.clientX;
      this.canvas.lastPosY = evt.clientY;
    }
    if (activeObject?.name == 'rect') {
      if (this.selectedNode.length) {
        this.selectedNode.map((v: any) => this.canvas.remove(v))
      }
      this.selecetedObject = activeObject
      // top
      let height =activeObject.scaleX * activeObject.height
      let width = activeObject.scaleY * activeObject.width
      var childNode1: any = new fabric.Circle({
        left: activeObject.left + width / 2,
        top: activeObject.top - 20,
        strokeWidth: 1,
        stroke: 'black',
        radius: 5,
        fill: 'rgba(0,0,0,0)',
      });
      // bottom
      var childNode2: any = new fabric.Circle({
        left: activeObject.left + width / 2,
        top: activeObject.top + height + 20,
        strokeWidth: 1,
        stroke: 'black',
        radius: 5,
        fill: 'rgba(0,0,0,0)',
      });
      // right
      var childNode4: any = new fabric.Circle({
        left: activeObject.left + width + 20,
        top: activeObject.top + height / 2,
        strokeWidth: 1,
        stroke: 'black',
        radius: 5,
        fill: 'rgba(0,0,0,0)',
      });
      // left
      var childNode3: any = new fabric.Circle({
        left: activeObject.left - 20,
        top: activeObject.top + height / 2,
        strokeWidth: 1,
        stroke: 'black',
        radius: 5,
        fill: 'rgba(0,0,0,0)',
      });
      this.selecetedObject.nodes = [childNode1, childNode2, childNode3, childNode4]
      childNode1.type = 'top';
      childNode2.type = 'bottom';
      childNode3.type = 'right';
      childNode4.type = 'left';

      childNode1.name = 'node'
      childNode2.name = 'node'
      childNode3.name = 'node'
      childNode4.name = 'node'

      this.canvas.add(childNode1, childNode2, childNode3, childNode4)
      this.selectedNode = [childNode1, childNode2, childNode3, childNode4]
    }
    if (activeObject?.name == 'node') {
      this.createNode(activeObject)
    }
  };
  mouseMove(opt: any) {
    // console.log(opt)
    if (this.canvas.isDragging) {
      var e = opt.e;
      var vpt = this.canvas.viewportTransform;
      vpt[4] += e.clientX - this.canvas.lastPosX;
      vpt[5] += e.clientY - this.canvas.lastPosY;
      this.canvas.requestRenderAll();
      this.canvas.lastPosX = e.clientX;
      this.canvas.lastPosY = e.clientY;
    }
  }
  mouseUp(opt: any) {
    // on mouse up we want to recalculate new interaction
    // for all objects, so we call setViewportTransform
    // on mouse up we want to recalculate new interaction
    // for all objects, so we call setViewportTransform
    this.canvas.setViewportTransform(this.canvas.viewportTransform);
    this.canvas.isDragging = false;
    this.canvas.selection = true;
  };







  addLine() {
    let line = new fabric.Line([70, 100, 150, 200],
      { fill: '', stroke: 'black', objectCaching: false }
    )
    this.canvas.add(line);
    // this.updateBoard();
  }

  Zoom(opt: any) {
    var delta = opt.e.deltaY;
    var zoom = this.canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    this.canvas.setZoom(zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  }
  showGrid() {
    let size = 16
    const circlePositions = [[size, 0], [0, 0], [size, size], [0, size]]
    const circleStyle = `fill:${'#9d5867'};stroke:#9d5867;stroke-width:0;`

    const tileSvgString = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs/><g>
        ${circlePositions.map(([cx, cy]) => `<circle style="${circleStyle}" cx="${cx}" cy="${cy}" r="${0.5}"/>`).join("\n")}
    </g></svg>`
    function inlineSVGString(svgString: string) {
      return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`
    }
    function urlSVGString(svgString: string) {
      return `url("${inlineSVGString(svgString)}")`
    }
    const canvasBgCallback = () => setTimeout(() => this.canvas.requestRenderAll(), 0)
    //@ts-ignore
    this.canvas.setBackgroundColor({ source: inlineSVGString(tileSvgString) }, canvasBgCallback)
    // let options = {
    //   distance: 10,
    //   width: this.canvas.width,
    //   height: this.canvas.height,
    //   param: {
    //     stroke: "#ebebeb",
    //     strokeWidth: 1,
    //     selectable: false
    //   }
    // },
    //   gridLen = options.width / options.distance;

    // for (var i = 0; i < gridLen; i++) {
    //   var distance = i * options.distance,
    //     horizontal = new fabric.Line(
    //       [distance, 0, distance, options.width],
    //       options.param
    //     ),
    //     vertical = new fabric.Line(
    //       [0, distance, options.width, distance],
    //       options.param
    //     );
    //   this.canvas.add(horizontal);
    //   this.canvas.add(vertical);
    //   if (i % 5 === 0) {
    //     horizontal.set({ stroke: "#cccccc" });
    //     vertical.set({ stroke: "#cccccc" });
    //   }
    // }
  }


  addRect() {
    var rect = new fabric.Rect({
      top: 100,
      left: 100,
      width: 100,
      height: 70,

      fill: 'rgba(0,0,0,0)',
      stroke: 'black',
      strokeWidth: 2
    });
    // return rect'
    rect.name = 'rect'
    this.canvas.add(rect);
    // this.updateBoard()
  }
  addCircle() {
    var rect = new fabric.Circle({
      top: 100,
      left: 100,
      radius: 50,
      fill: 'rgba(0,0,0,0)',
      stroke: 'black',
      strokeWidth: 2
    });
    rect.name = 'rect'
    this.canvas.add(rect);
    // this.updateBoard();
  }

  addTriangle() {
    var rect = new fabric.Triangle({
      top: 100,
      left: 100,
      height: 100,
      fill: 'rgba(0,0,0,0)',
      stroke: 'black',
      strokeWidth: 2
    });
    rect.name = 'rect'
    this.canvas.add(rect);
    // this.updateBoard()
  }

  addTextBox() {
    var rect = new fabric.IText('Text', {
      top: 100,
      left: 100,
      fill: 'rgba(0,0,0,0)',
      stroke: 'black',
      strokeWidth: 2
    });

    // let c: any = new fabric.Circle({
    //   left: 100 + 50,
    //   top: 100,
    //   strokeWidth: 5,
    //   radius: 6,
    //   fill: '#fff',
    //   stroke: '#666',

    // });
    // c.name = this.objectCount
    // return rect
    // let group = new fabric.Group([rect, c])
    this.canvas.add(rect);
    this.objectCount++
    // this.updateBoard()
  };

  addTextBoxCircle() {
    let text = this.addTextBox()
    // let box = this.addRect()
    // var group = new fabric.Group([text,box])
    // this.canvas.add(group);
  }

  createNode(node: any) {
    let scaleX =this.selecetedObject.scaleX * this.selecetedObject.height
    let width = this.selecetedObject.scaleY * this.selecetedObject.width
    if (node.type == 'left') {
      var rect: any = new fabric.Rect({
        top: this.selecetedObject.top,
        left: this.selecetedObject.left + 200,
        width: 100,
        height: 70,
        fill: 'rgba(0,0,0,0)',
        stroke: 'black',
        strokeWidth: 2
      });
      var line = new fabric.Line([node.left, node.top, rect.left - 20, rect.top + rect.height / 2], {
        strokeWidth: 2,
        stroke: 'black'
      });
      line.selectable = false;
      // return rect'
      this.canvas.add(line)
      rect.name = 'rect'
      rect.parentLeftNode = [line];
      if (this.selecetedObject.rightNode?.length)
        this.selecetedObject.rightNode.push(line)
      else this.selecetedObject.rightNode = [line]
      this.canvas.add(rect);

      this.canvas.renderAll()
    }

    else if (node.type == 'right') {
      var rect: any = new fabric.Rect({
        top: this.selecetedObject.top,
        left: (this.selecetedObject.left - 20) - 200,
        width: 100,
        height: 70,
        fill: 'rgba(0,0,0,0)',
        stroke: 'black',
        strokeWidth: 2
      });
      var line = new fabric.Line([node.left, node.top, rect.left + rect.width + 20, rect.top + rect.height / 2], {
        strokeWidth: 2,
        stroke: 'black'
      });
      line.selectable = false;
      // return rect'
      this.canvas.add(line)
      rect.name = 'rect'
      rect.parentRightNode = [line];
      if (this.selecetedObject?.leftNode?.length)
        this.selecetedObject.leftNode.push(line)
      else this.selecetedObject.leftNode = [line]
      this.canvas.add(rect);

      this.canvas.renderAll()
    }

    else if (node.type == 'top') {
      var rect: any = new fabric.Rect({
        top: this.selecetedObject.top - 200,
        left: (this.selecetedObject.left),
        width: 100,
        height: 70,
        fill: 'rgba(0,0,0,0)',
        stroke: 'black',
        strokeWidth: 2
      });
      var line = new fabric.Line([node.left, node.top, rect.left + rect.width / 2, rect.top + rect.height + 20], {
        strokeWidth: 2,
        stroke: 'black'
      });
      line.selectable = false;
      // return rect'
      this.canvas.add(line)
      rect.name = 'rect'
      rect.parentBottomNode = [line];
      if (this.selecetedObject?.topNode?.length)
        this.selecetedObject.topNode.push(line)
      else this.selecetedObject.topNode = [line]
      this.canvas.add(rect);

      this.canvas.renderAll()
    }

    else if (node.type == 'bottom') {
      var rect: any = new fabric.Rect({
        top: this.selecetedObject.top + this.selecetedObject.height + 100,
        left: (this.selecetedObject.left),
        width: 100,
        height: 70,
        fill: 'rgba(0,0,0,0)',
        stroke: 'black',
        strokeWidth: 2
      });
      var line = new fabric.Line([node.left, node.top, rect.left + rect.width / 2, rect.top - 20], {
        strokeWidth: 2,
        stroke: 'black'
      });
      line.selectable = false;
      // return rect'
      this.canvas.add(line)
      rect.name = 'rect'
      rect.parentTopNode = [line];
      if (this.selecetedObject?.bottomNode?.length)
        this.selecetedObject.bottomNode.push(line)
      else this.selecetedObject.bottomNode = [line]
      this.canvas.add(rect);

      this.canvas.renderAll()
    }
  }




  onObjectSelected(e: any) {
    var activeObject = e?.selected[0];
    if (activeObject.name == "p0" || activeObject.name == "p2") {
      activeObject.line2.animate('opacity', '1', {
        duration: 200,
        onChange: this.canvas.renderAll.bind(this.canvas),
      });
      activeObject.line2.selectable = true;
    }
  }
  selecetedObject: any
  onSelectionCleared(e: any) {
    var activeObject = e.deselected[0];
    // this.selecetedObject = {}
    if (activeObject.name == "p0" || activeObject.name == "p2") {
      activeObject.line2.animate('opacity', '0', {
        duration: 200,
        onChange: this.canvas.renderAll.bind(this.canvas),
      });
      activeObject.line2.selectable = false;
    }
    else if (activeObject.name == "p1") {
      activeObject.animate('opacity', '0', {
        duration: 200,
        onChange: this.canvas.renderAll.bind(this.canvas),
      });
      activeObject.selectable = false;
    }
  }

  onObjectMoving(e: any) {
    if (e.target.name == "rect" || e.target.name == "rect") {
      var p = e.target;
      // console.log(p)
      if (p?.nodes?.length) {
        let height =p.scaleX * p.height
        let width = p.scaleY * p.width
        p?.nodes[0].set({
          left: p.left + width / 2,
          top: p.top - 20,
        })
        p?.nodes[1].set({
          left: p.left + width / 2,
          top: p.top + height + 20,
        })
        p?.nodes[2].set({
          left: p.left + width + 20,
          top: p.top + height / 2,
        })
        p?.nodes[3].set({
          left: p.left - 20,
          top: p.top +height / 2,
        })
      }
      if (p?.rightNode?.length) {
        p?.rightNode.map((v: any) => {
          v && v.set({ 'x2': p.left + p.width + 20, 'y2': p.top + p.height / 2, 'x1': v.x1, 'y1': v.y1 });
        })
      }
      if (p.leftNode?.length) {
        p?.leftNode.map((v: any) => {
          v && v.set({ 'x2': p.left - 20, 'y2': p.top + p.height / 2, 'x1': v.x1, 'y1': v.y1 });
        })
        // p.line3 && p.line3.set({ 'x1':  p.left + p.width + 20, 'y1':  p.top + p.height / 2 });
      }
      if (p.topNode?.length) {
        p?.topNode.map((v: any) => {
          v && v.set({ 'x2': p.left + p.width / 2, 'y2': p.top - 20, 'x1': v.x1, 'y1': v.y1 });
        })
        // p.line3 && p.line3.set({ 'x2':  p.left + p.width + 20, 'y1':  p.top + p.height / 2 });
      }
      if (p.bottomNode?.length) {
        p?.bottomNode.map((v: any) => {
          v && v.set({ 'x2': p.left + p.width / 2, 'y2': p.top + p.height + 20, 'x1': v.x1, 'y1': v.y1 });
        })
        // p.line3 && p.line3.set({ 'x1':  p.left + p.width + 20, 'y1':  p.top + p.height / 2 });
      }
      if (p?.parentRightNode?.length) {
        p?.parentRightNode.map((v: any) => {
          v && v.set({ 'x1': p.left + p.width + 20, 'y1': p.top + p.height / 2, 'x2': v.x2, 'y2': v.y2 });
        })
      }
      if (p.parentLeftNode?.length) {
        p?.parentLeftNode.map((v: any) => {
          v && v.set({ 'x1': p.left - 20, 'y1': p.top + p.height / 2, 'x2': v.x2, 'y2': v.y2 });
        })
        // p.line3 && p.line3.set({ 'x1':  p.left + p.width + 20, 'y1':  p.top + p.height / 2 });
      }
      if (p.parentTopNode?.length) {
        p?.parentTopNode.map((v: any) => {
          v && v.set({ 'x1': p.left + p.width / 2, 'y1': p.top - 20, 'x2': v.x2, 'y2': v.y2 });
        })
        // p.line3 && p.line3.set({ 'x1':  p.left + p.width + 20, 'y1':  p.top + p.height / 2 });
      }
      if (p.parentBottomNode?.length) {
        p?.parentBottomNode.map((v: any) => {
          v && v.set({ 'x1': p.left + p.width / 2, 'y1': p.top + p.height + 20, 'x2': v.x2, 'y2': v.y2 });
        })
        // p.line3 && p.line3.set({ 'x1':  p.left + p.width + 20, 'y1':  p.top + p.height / 2 });
      }
      this.canvas.renderAll();
    }
  }
}
