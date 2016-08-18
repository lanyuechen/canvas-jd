/**
 * Created by Molay on 15/10/31.
 */
(function () {
    // abstract position creator, implement 1
    function PositionCreator1() {
        this._startRadius = 30;
        this._endHeight = 30;
        this._frequency = 1;
        this._amplitude = 0;
        this._minRadius = 1;
        this._rhoAmplitude = 3;

        this._angleIndices = [
                UA * 0,
                UA * 60,
                UA * 120,
                UA * 180,
                UA * 240,
                UA * 300
        ];

        this._positionFunctions = [
            this.createPositionFunction(0.80, 1.10, 1.50, 1.00),
            this.createPositionFunction(1.10, 1.00, 0.50, 0.50),
            this.createPositionFunction(1.20, 0.60, 0.50, 0.50),
            this.createPositionFunction(1.10, 0.80, 0.50, 0.50),
            this.createPositionFunction(1.00, 0.90, 1.50, 0.50),
            this.createPositionFunction(0.90, 1.10, 1.50, 1.00)
        ];
    }

    PositionCreator1.prototype = {};
    PositionCreator1.prototype._startRadius = 1;
    PositionCreator1.prototype._minRadius = 1;
    PositionCreator1.prototype._rhoAmplitude = 1;
    PositionCreator1.prototype._endHeight = 1;
    PositionCreator1.prototype._frequency = 1;
    PositionCreator1.prototype._amplitude = 1;
    PositionCreator1.prototype._angleIndices = [];
    PositionCreator1.prototype._positionFunctions = [];
    PositionCreator1.prototype.createPositionFunction = function (radiusRatio, heightRatio, phiRatio, rhoRatio) {
        return function (t, a) {

            var radius = Math.max(this._startRadius * radiusRatio * (1 - t), this._minRadius);
            var height = Math.min(this._endHeight, Math.max(0, t * heightRatio * this._endHeight));
            var phi = Math.min(Math.max((1 - t * phiRatio) * HP, 0), HP);
            var theta = a;
            var rho = (1 - t * rhoRatio) * radius + Math.sin(t * DP * 2.5) * this._rhoAmplitude;

            theta += Math.sin(t * HP) * HP / 3;

            var vector3 = new THREE.Vector3();
            vector3.x = radius * Math.cos(theta);
            vector3.z = radius * Math.sin(theta);
            vector3.y = rho * Math.cos(phi) + height;
            if (t < 0) vector3.y += Math.sin(t * DP) * Math.cos(a * 4) * 4;

            return vector3;
        }.bind(this);
    };
    PositionCreator1.prototype.calculate = function (t, a) {

        if (this._angleIndices.length != this._positionFunctions.length) {
            throw new Error(':<');
        }

        var startIndex = WS.MathUtil.calculateStartIndex(this._angleIndices, a, true);
        var endIndex = WS.MathUtil.calculateEndIndex(this._angleIndices, a, true);
        var startAngle = this._angleIndices[startIndex];
        var endAngle = this._angleIndices[endIndex];
        if (startAngle > endAngle) endAngle += DP;
        if (startAngle > a) a += DP;
        var percent = (a - startAngle) / (endAngle - startAngle);

        var startVector3 = this._positionFunctions[startIndex](t, startAngle);
        var endVector3 = this._positionFunctions[endIndex](t, endAngle);

        var vector3 = new THREE.Vector3();
        vector3.x = startVector3.x + (endVector3.x - startVector3.x) * percent;
        vector3.y = startVector3.y + (endVector3.y - startVector3.y) * percent;
        vector3.z = startVector3.z + (endVector3.z - startVector3.z) * percent;

        var phi = Math.min(HP, Math.max(0, HP * (1 - t)));

        vector3.x += Math.cos(this._frequency * phi) * this._amplitude;
        vector3.z += Math.sin(this._frequency * phi) * this._amplitude;
        vector3.y += Math.cos(this._frequency * phi) * this._amplitude;

        return vector3;
    };


    WS.WavedMountainAnimator = function (vertice, t, a) {
        this.vertice = vertice;
        this.t = t;
        this.a = a;
    };

    WS.WavedMountainAnimator.prototype = {
        positionCreator: new PositionCreator1(),
        vertice: null,
        t: 0,
        a: 0,
        tSpeed: 0.005,
        animate: function () {
            if (this.vertice == null) return;

            this.t += this.tSpeed;
            if (this.t > 1)
            {
                var v = this.positionCreator.calculate(1, this.a);
                this.vertice.set(v.x, v.y, v.z);
                if (this.t > 1 + this.tSpeed) this.t = - Math.random() * 3;
            }
            else
            {
                var v = this.positionCreator.calculate(this.t, this.a);
                this.vertice.set(v.x, v.y, v.z);
            }

        }
    };
})();