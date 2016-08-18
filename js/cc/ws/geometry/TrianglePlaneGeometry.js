/**
 * Created by Molay on 15/10/31.
 */

WS.TrianglePlaneGeometry = function (width, height) {
    THREE.BufferGeometry.call(this);

    this.type = 'TrianglePlaneGeometry';

    this.parameters = {
        width: width,
        height: height
    };

    width = width || 2;
    height = height || 1;

    var halfWidth = width / 2;
    var halfHeight = height / 2;
    var vertices = [
        [-halfWidth, -halfHeight, 0],
        [halfWidth, -halfHeight, 0],
        [0, halfHeight, 0]
    ];
    var indices = [
        0, 1, 2
    ];

    var vertexCount = vertices.length;
    var positions = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
    //var normals = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
    var uvs = new THREE.BufferAttribute(new Float32Array(vertexCount * 2), 2);

    var vector3 = new THREE.Vector3();
    var index = 0;
    for (var i = 0; i < vertices.length; i++) {
        var verticesRow = vertices[i];
        vector3.set(verticesRow[0], verticesRow[1], verticesRow[2]);

        positions.setXYZ(index, vector3.x, vector3.y, vector3.z);
        vector3.normalize();
        //normals.setXYZ(index, vector3.x, vector3.y, vector3.z);

        // uv on the triangle face.
        var k = index % 3;
        if (k == 0)
            uvs.setXY(index, 0.0, 1 - 1);
        else if (k == 1)
            uvs.setXY(index, 1.0, 1 - 1);
        else if (k == 2)
            uvs.setXY(index, 0.5, 1 - 0);

        index++;
    }

    this.setIndex(new THREE.Uint16Attribute(indices, 1));
    this.addAttribute('position', positions);
    //this.addAttribute('normal', normals);
    this.addAttribute('uv', uvs);
};

WS.TrianglePlaneGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
WS.TrianglePlaneGeometry.prototype.constructor = WS.TrianglePlaneGeometry;

WS.TrianglePlaneGeometry.prototype.clone = function () {

    var parameters = this.parameters;

    return new WS.TrianglePlaneGeometry(
        parameters.width,
        parameters.height
    );

};