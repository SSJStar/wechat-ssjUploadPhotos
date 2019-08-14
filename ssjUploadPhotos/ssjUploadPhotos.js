// components/ssjUploadPhotos/ssjUploadPhotos.js
/** 参数解释
 * 对外参数：
 * maxSelectCount，可选照片的最大张数，不填写状态下 不会显示‘[1/5]’
 * title：标题，当前组件的一个标题
 * 
 * 似有属性：
 * dataList：图片显示的URL数据源，最后一条数据可能包含‘+’图片地址
 * showSelectedCount：[已选择张数/可选最大张数]
 * icon_addImageUrl：   ‘+’ 图片本地路径
 * icon_deleteImageUrl：‘x’ 图片本地路径
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //最大张数
    maxSelectCount: {
      value: 'MAX', //默认值
      type: String
    },
    //标题
    title: {
      value: '请选择要上传的图片', //默认值
      type: String
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    dataList: [
      '../../images/photos_add.png', //图片展示数据
    ],
    showSelectedCount: '', // [已选择/可选最大]
    //图片新增时的 ’+‘图片
    icon_addImageUrl: '../../images/photos_add.png',
    //图片删除时的 ‘x’图片 右上角
    icon_deleteImageUrl: '../../images/icon-delete.png'
  },
  pageLifetimes: {
    show: function() {
      //更新 [已选择/可选最大]
      this._updateShowSelectedCount()
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击图片   添加/浏览
     */
    childViewClick: function(e) {

      var current = e.target.dataset.src;
      var indexValue = e.currentTarget.dataset.index
      if (this.data.dataList.length > 0) {
        var clickData = this.data.dataList[indexValue]
        if (clickData == this.data.icon_addImageUrl) {
          //开始选择
          var that = this
          var thatselectedFilePaths = that.data.dataList;
          //获取可选最大张数
          let maxSelectCountV = this._getChooseMax()
          console.log('maxSelectCount58:' + maxSelectCountV)
          if (maxSelectCountV == 0) {
            wx.showToast({
              title: '已经达到最大张数',
            })
            return
          }
          wx.chooseImage({
            count: maxSelectCountV,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
              // tempFilePath可以作为img标签的src属性显示图片
              // const tempFilePath = res.tempFilePaths[0]
              console.log('res:' + JSON.stringify(res))
              //先将‘+’图片取出来，等添加完新选择照片后，放到最后
              var lengthV = thatselectedFilePaths.length - 1
              thatselectedFilePaths.splice(lengthV, 1)
              thatselectedFilePaths = thatselectedFilePaths.concat(res.tempFilePaths)
              //保存数据
              that.setData({
                dataList: thatselectedFilePaths,
              })
              //此处的dataList不包含‘+’图片 可以直接传给调用者
              that._pushDataOut(thatselectedFilePaths)
              //更新 [已选择/可选最大]，追加‘+’图片
              that._updateShowSelectedCount()
              console.log('选完图片后datalist数组：' + JSON.stringify(thatselectedFilePaths))
            }
          })

        } else {
          this._preview(e)
        }
      } else {
        console.log('dateList为空')
      }

    },

    /**
     * 删除图片
     */
    deleteImage: function(e) {
      var deleteIndex = e.currentTarget.dataset.index
      console.log('删除的图片下标：' + deleteIndex)
      var originalList = this.data.dataList
      originalList.splice(deleteIndex, 1)
      // //保存数据
      this.setData({
        dataList: originalList
      })
      //更新 [已选择/可选最大]
      this._updateShowSelectedCount()
    },

    /**
     * 更新showSelectedCount
     */
    _updateShowSelectedCount: function() {
      var selectedCount = this.data.dataList.length
      var allCount = this.data.maxSelectCount
      //如果最后一张是'+'图片 统计的时候减去1
      var lastUrl = this.data.dataList[this.data.dataList.length - 1]
      if (lastUrl == this.data.icon_addImageUrl) {
        selectedCount--
      } else {
        //最后一张不是‘+’图片
        //如果已经达到最大张数，就不显示‘+’号图片，否则：
        if (selectedCount < allCount) {
          var dataListV = this.data.dataList
          dataListV.push(this.data.icon_addImageUrl)
          this.setData({
            dataList: dataListV
          })
        }
      }
      //表示有设置过最大张数
      if (this.data.maxSelectCount != 'MAX') { 
        if (selectedCount <= allCount) {
          this.setData({
            showSelectedCount: `[${selectedCount}/${allCount}]`
          })
        }
      }

    },

    /**
     * 将选择的图片数据传递给调用者
     * tempFilePaths:图片.本地临时路径
     */
    _pushDataOut: function(tempFilePaths) {
      var jsonData = {
        'images': tempFilePaths,
      }
      this.triggerEvent('gainImageFilePaths', jsonData, {})
    },

    /**
     * 判断距离最大可选张数，还有几张可选
     * 比如最大张数9张，已经选择了8张，那么再次点击加号，应该只可以选一张
     */
    _getChooseMax: function() {
      // 此处要把‘+’图片去掉，所以要减去1
      var selectedCount = this.data.dataList.length - 1
      var allCount = this.data.maxSelectCount
      if (selectedCount < allCount) {
        return parseInt(allCount) - parseInt(selectedCount)
      } else {
        return 0
      }
    },

    /**
     * 图片点击
     */
    _preview: function(e) {
      var that = this
      var current = e.target.dataset.url;
      var urlsV = this.data.dataList
      //判断最后一张如果是‘+’图片去掉
      var defaultHeadUrl = this.data.icon_addImageUrl
      var isRemove = false
      if (urlsV[urlsV.length - 1] == defaultHeadUrl) {
        urlsV.splice(urlsV.length - 1, 1)
        isRemove = true
      }
      wx.previewImage({
        urls: urlsV,
        current: current,
        success: function(e) {
          console.log('图片加载成功！')
        },
        complete: function() {
          console.log('complete!!!')
          if (isRemove) {
            //将‘+’图片追加上
            urlsV.push(defaultHeadUrl)
          }
        }

      })
    },

  }
})